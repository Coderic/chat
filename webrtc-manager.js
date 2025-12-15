// WebRTCManager simplificado para los ejemplos
class WebRTCManager {
  constructor(socket, config = {}) {
    this.socket = socket;
    this.config = {
      iceServers: config.iceServers || [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    };
    this.peers = new Map();
    this.localStream = null;
    this.roomId = null;
    this.setupSocketHandlers();
  }

  setupSocketHandlers() {
    this.socket.on('relay', (data) => {
      if (!data.tipo?.startsWith('webrtc:')) return;
      switch (data.tipo) {
        case 'webrtc:joined':
          this.handleJoined(data);
          break;
        case 'webrtc:peer-joined':
          this.handlePeerJoined(data);
          break;
        case 'webrtc:offer':
          this.handleOffer(data);
          break;
        case 'webrtc:answer':
          this.handleAnswer(data);
          break;
        case 'webrtc:ice-candidate':
          this.handleIceCandidate(data);
          break;
        case 'webrtc:peer-left':
          this.handlePeerLeft(data);
          break;
      }
    });
  }

  handleJoined(data) {
    this.roomId = data.roomId;
    // Los peers vienen como peerIds del servidor
    data.peers?.forEach(peerId => {
      if (peerId !== this.socket.id) {
        this.createPeerConnection(peerId, true);
      }
    });
  }

  handlePeerJoined(data) {
    const { peerId, socketId } = data;
    // Usar peerId como identificador principal
    const targetPeerId = peerId || socketId;
    if (targetPeerId && targetPeerId !== this.socket.id && !this.peers.has(targetPeerId)) {
      this.createPeerConnection(targetPeerId, true); // true para crear offer
    }
  }

  async handleOffer(data) {
    const { from, to, offer } = data;
    // 'to' es el peerId (socket.id del destinatario)
    if (to !== this.socket.id) return;
    let pc = this.peers.get(from);
    if (!pc) pc = this.createPeerConnection(from, false);
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    this.socket.emit('relay', {
      destino: 'room',
      room: this.roomId,
      tipo: 'webrtc:answer',
      to: from, // from es el peerId del emisor
      answer: pc.localDescription
    });
  }

  async handleAnswer(data) {
    const { from, to, answer } = data;
    if (to !== this.socket.id) return;
    const pc = this.peers.get(from);
    if (pc) await pc.setRemoteDescription(new RTCSessionDescription(answer));
  }

  async handleIceCandidate(data) {
    const { from, to, candidate } = data;
    if (to !== this.socket.id) return;
    const pc = this.peers.get(from);
    if (pc && candidate) await pc.addIceCandidate(new RTCIceCandidate(candidate));
  }

  handlePeerLeft(data) {
    const peerId = data.peerId || data.socketId;
    if (peerId) {
      this.closePeerConnection(peerId);
    }
  }

  createPeerConnection(peerId, createOffer) {
    const pc = new RTCPeerConnection(this.config);
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => pc.addTrack(track, this.localStream));
    }
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('relay', {
          destino: 'room',
          room: this.roomId,
          tipo: 'webrtc:ice-candidate',
          to: peerId,
          candidate: event.candidate
        });
      }
    };
    pc.ontrack = (event) => {
      if (this.onRemoteStream) this.onRemoteStream(peerId, event.streams[0]);
    };
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        this.closePeerConnection(peerId);
      }
    };
    this.peers.set(peerId, pc);
    if (createOffer) this.createOffer(peerId);
    return pc;
  }

  async createOffer(peerId) {
    const pc = this.peers.get(peerId);
    if (!pc) return;
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    this.socket.emit('relay', {
      destino: 'room',
      room: this.roomId,
      tipo: 'webrtc:offer',
      to: peerId,
      offer: pc.localDescription
    });
  }

  async setLocalStream(stream) {
    this.localStream = stream;
    this.peers.forEach((pc) => {
      stream.getTracks().forEach(track => {
        const sender = pc.getSenders().find(s => s.track?.kind === track.kind);
        if (sender) sender.replaceTrack(track);
        else pc.addTrack(track, stream);
      });
    });
  }

  async joinRoom(roomId) {
    this.roomId = roomId;
    this.socket.emit('unirse', roomId, (ok) => {
      if (ok) {
        this.socket.emit('relay', {
          destino: 'room',
          room: roomId,
          tipo: 'webrtc:join',
          roomId,
          peerId: this.socket.id
        });
      }
    });
  }

  toggleAudio(enabled) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => track.enabled = enabled);
    }
  }

  toggleVideo(enabled) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => track.enabled = enabled);
    }
  }

  destroy() {
    this.peers.forEach((pc) => pc.close());
    this.peers.clear();
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
  }
}
