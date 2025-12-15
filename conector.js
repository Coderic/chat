/**
 * Conector Relay v2
 * Cliente JavaScript para conectarse al gateway Relay
 * 
 * Uso:
 *   const relay = new RelayConector('http://localhost:5000');
 *   await relay.conectar();
 *   await relay.identificar('miUsuario');
 *   relay.enviarATodos({ mensaje: 'Hola!' });
 *   relay.on('relay', (data) => console.log(data));
 */

class RelayConector {
  constructor(url = 'http://localhost:5000') {
    this.url = url;
    this.socket = null;
    this.usuario = null;
    this.listeners = {};
    this.connected = false;
  }

  conectar() {
    return new Promise((resolve, reject) => {
      if (typeof io === 'undefined') {
        reject(new Error('Socket.io no cargado. Incluye: <script src="https://cdn.socket.io/4.7.4/socket.io.min.js"></script>'));
        return;
      }

      this.socket = io(this.url + '/relay', {
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        console.log('Relay: Conectado -', this.socket.id);
        this.connected = true;
        this._emit('connect', { socketId: this.socket.id });
        resolve(this);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Relay: Desconectado -', reason);
        this.connected = false;
        this._emit('disconnect', { reason });
      });

      this.socket.on('connect_error', (error) => {
        console.error('Relay: Error -', error.message);
        this._emit('error', error);
        reject(error);
      });

      // Eventos de Relay
      this.socket.on('notificar', (data) => this._emit('notificar', data));
      this.socket.on('relay', (data) => this._emit('relay', data));
    });
  }

  identificar(usuario) {
    return new Promise((resolve) => {
      this.usuario = usuario;
      this.socket.emit('identificar', usuario, (ok) => {
        console.log('Relay: Identificado como', usuario);
        this._emit('identificado', { usuario, ok });
        resolve(ok);
      });
    });
  }

  // Enviar mensaje por el canal 'relay'
  enviar(data) {
    this.socket.emit('relay', data);
  }

  // Enviar notificación
  notificar(data) {
    this.socket.emit('notificar', data);
  }

  // Atajos para destinos
  enviarAMi(data) {
    this.enviar({ ...data, destino: 'yo' });
  }

  enviarAOtros(data) {
    this.enviar({ ...data, destino: 'ustedes' });
  }

  enviarATodos(data) {
    this.enviar({ ...data, destino: 'nosotros' });
  }

  // Sistema de eventos
  on(evento, callback) {
    if (!this.listeners[evento]) {
      this.listeners[evento] = [];
    }
    this.listeners[evento].push(callback);
    return this;
  }

  off(evento, callback) {
    if (this.listeners[evento]) {
      this.listeners[evento] = this.listeners[evento].filter(cb => cb !== callback);
    }
    return this;
  }

  _emit(evento, data) {
    if (this.listeners[evento]) {
      this.listeners[evento].forEach(cb => cb(data));
    }
  }

  desconectar() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

// Exportar para uso en módulos o global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RelayConector;
} else {
  window.RelayConector = RelayConector;
}

