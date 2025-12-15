# 💬 Ejemplos de Chat - Relay v2.2

Colección completa de ejemplos de chat demostrando todas las capacidades de [Coderic Relay](https://github.com/Coderic/relay) v2.2.

![Chat Demo](https://img.shields.io/badge/demo-online-green)
![Relay Version](https://img.shields.io/badge/relay-v2.2.0-blue)

## 🚀 Inicio Rápido

### Prerrequisitos

1. Tener Relay Gateway ejecutándose en `http://localhost:5000`

```bash
# Opción 1: Con Docker
docker run -p 5000:5000 ghcr.io/coderic/relay:latest

# Opción 2: Con npm
npx @coderic/relay

# Opción 3: Desde el repositorio
git clone https://github.com/Coderic/relay.git
cd relay && npm install && npm start
```

### Ejecutar los ejemplos

```bash
# Clonar este repositorio
git clone https://github.com/Coderic/chat.git
cd chat

# Servir los archivos estáticos
npx serve -p 8000
```

Abre http://localhost:8000 en tu navegador y selecciona el ejemplo que quieras probar.

## 📚 Ejemplos Incluidos

### 1. 💬 Chat Básico

Chat en tiempo real multi-usuario. Ejemplo fundamental de comunicación con Relay.

**Características:**
- Mensajería en tiempo real
- Multi-usuario
- Presencia de usuarios
- API básica de Relay (`enviarATodos`, `enviarAOtros`, `enviarAMi`)

**Archivo:** `chat-basico.html`

### 2. 🏠 Chat con Rooms

Chat segmentado por rooms. Únete a múltiples salas y chatea con grupos específicos.

**Características:**
- Múltiples rooms
- Crear rooms dinámicamente
- Mensajes por room
- API de rooms (v2.1+)

**Archivo:** `chat-rooms.html`

**Código de ejemplo:**
```javascript
// Unirse a un room
socket.emit('unirse', 'mi-room');

// Enviar mensaje al room
socket.emit('relay', {
  destino: 'room',
  room: 'mi-room',
  tipo: 'mensaje',
  usuario: 'Juan',
  texto: 'Hola room!'
});
```

### 3. 📹 Chat con Video

Combina chat de texto con video llamadas. Comunícate por texto y video simultáneamente.

**Características:**
- Chat de texto en sidebar
- Video llamadas P2P
- Audio en tiempo real
- Plugin WebRTC (v2.2+)

**Archivo:** `chat-video.html`

**Código de ejemplo:**
```javascript
import { WebRTCManager } from '@coderic/relay';

const webrtc = new WebRTCManager(socket);
const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
await webrtc.setLocalStream(stream);
await webrtc.joinRoom('video-room');
```

### 4. 📞 Llamadas WebRTC

Aplicación completa de llamadas de video. Múltiples participantes, controles y más.

**Características:**
- Video llamadas grupales (mesh topology)
- Compartir pantalla
- Controles de audio/video
- Múltiples participantes simultáneos

**Archivo:** `llamadas-webrtc.html`

## 🎯 Tecnologías

- **Relay Gateway**: Infraestructura de mensajería en tiempo real
- **Socket.io**: WebSocket para comunicación bidireccional
- **WebRTC**: Video/audio P2P
- **Vanilla JavaScript**: Sin frameworks, código puro

## 📖 Cómo Funciona

Todos los ejemplos usan la API inmutable de Relay:

```javascript
// 1. Conectar
const socket = io('http://localhost:5000/relay');

// 2. Identificarse
socket.emit('identificar', 'mi-usuario');

// 3. Unirse a un room (opcional, v2.1+)
socket.emit('unirse', 'mi-room');

// 4. Enviar mensajes
socket.emit('relay', {
  destino: 'room',  // o 'nosotros', 'ustedes', 'yo'
  room: 'mi-room',
  tipo: 'mensaje',
  usuario: 'Juan',
  texto: 'Hola!'
});

// 5. Recibir mensajes
socket.on('relay', (data) => {
  console.log('Mensaje recibido:', data);
});
```

## 🎨 Destinos Disponibles

| Destino | Descripción | Uso |
|---------|-------------|-----|
| `yo` | Solo al emisor | Mensajes privados |
| `ustedes` | A todos menos el emisor | Broadcast excluyente |
| `nosotros` | A todos incluyendo el emisor | Broadcast completo |
| `room` | A todos en el room (v2.1+) | Mensajes por grupo |

## 🔗 Enlaces

- 📦 [Repositorio Relay](https://github.com/Coderic/relay)
- 📚 [Documentación Relay](https://relay.coderic.net)
- 🐛 [Issues](https://github.com/Coderic/chat/issues)
- 🌐 [Demo en línea](https://coderic.org/chat/)

## 📄 Licencia

MIT © [Coderic](https://github.com/Coderic)
