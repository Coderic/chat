# 💬 Chat en Tiempo Real

Ejemplo de chat en tiempo real multi-usuario utilizando **[Relay Gateway](https://github.com/Coderic/Relay)**.

![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript)
![Relay](https://img.shields.io/badge/Relay-Gateway-blueviolet)

## 📖 Sobre este Ejemplo

Este ejemplo funcional demuestra cómo construir un chat en tiempo real multi-usuario usando Relay Gateway. Es el ejemplo más básico y perfecto para entender cómo funciona Relay. Este ejemplo muestra:

- 💬 **Chat multi-usuario** - Múltiples usuarios pueden chatear simultáneamente
- 👤 **Identificación por nickname** - Cada usuario se identifica con un nombre único
- ⚡ **Mensajes en tiempo real** - Los mensajes aparecen instantáneamente para todos los usuarios
- 📨 **Historial de mensajes** - Los mensajes se mantienen durante la sesión
- 🔔 **Indicadores de usuario** - Muestra quién está conectado

Este ejemplo pertenece a la colección de ejemplos de **[Relay Gateway](https://github.com/Coderic/Relay)**, un gateway de comunicación en tiempo real diseñado para ser inmutable y agnóstico.

## 🚀 Inicio Rápido

### Prerrequisitos

- Un navegador web moderno
- Relay Gateway ejecutándose (ver [documentación de Relay](https://relay.coderic.net))

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Coderic/chat.git
cd chat
```

No se requiere instalación de dependencias, este ejemplo usa CDN para las librerías.

### Configuración

Abre `index.html` en tu navegador o sirve los archivos con un servidor HTTP simple:

```bash
# Con Python
python3 -m http.server 8000

# Con Node.js (http-server)
npx http-server -p 8000

# Con PHP
php -S localhost:8000
```

El ejemplo se conecta automáticamente a `http://demo.relay.coderic.net` (endpoint público de Relay para pruebas).

Para usar Relay localmente, modifica el archivo `conector.js`:

```javascript
const relay = new RelayConector('http://localhost:5000');
```

Y ejecuta Relay:

```bash
# Opción 1: Con npx (recomendado para pruebas)
npx @coderic/relay

# Opción 2: Con Docker Compose
docker compose up -d
```

## 🎯 Uso

1. **Abrir múltiples pestañas** del navegador para simular diferentes usuarios
2. **Ingresar un nickname** en cada pestaña
3. **Enviar mensajes** - Los mensajes aparecerán en tiempo real en todas las pestañas
4. **Observar** cómo los mensajes se sincronizan instantáneamente

## 🔗 Enlaces

- 📦 [Repositorio](https://github.com/Coderic/chat)
- 🐛 [Issues](https://github.com/Coderic/chat/issues)
- 🌐 [Demo en línea](https://coderic.org/chat/)
- 📚 [Documentación de Relay](https://relay.coderic.net)
- ⚡ [Relay Gateway](https://github.com/Coderic/Relay)

## 🛠️ Tecnologías

- **HTML5** - Estructura de la aplicación
- **JavaScript (ES6+)** - Lógica de la aplicación
- **Socket.io** - Comunicación WebSocket (via CDN)
- **Relay Gateway** - Gateway de comunicación en tiempo real
- **RelayConector** - Cliente JavaScript para conectar con Relay

## 📝 Licencia

MIT
