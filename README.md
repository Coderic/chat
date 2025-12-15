# 💬 Chat en Tiempo Real

Ejemplo de chat en tiempo real utilizando [Relay Gateway](https://github.com/NeftaliYagua/Relay).

![Chat Demo](https://img.shields.io/badge/demo-online-green)

## 🚀 Inicio Rápido

### Prerrequisitos

1. Tener Relay Gateway ejecutándose en `http://localhost:5000`

```bash
# Opción 1: Con Docker Compose (recomendado)
cd infraestructura && docker compose up -d

# Opción 2: Directo con npx
npx relay-gateway
```

### Ejecutar el ejemplo

```bash
# Clonar este repositorio
git clone https://github.com/Coderic/relay-ejemplo-chat.git
cd relay-ejemplo-chat

# Servir los archivos estáticos
npx serve -p 8000
```

Abre http://localhost:8000 en tu navegador.

## 📖 Cómo funciona

Este chat utiliza la API inmutable de Relay:

```javascript
// Conectar a Relay
const relay = new RelayConector('http://localhost:5000');
await relay.conectar();

// Identificarse
await relay.identificar('MiNombre');

// Enviar mensaje a todos
relay.enviarATodos({
  tipo: 'mensaje',
  texto: 'Hola a todos!'
});

// Recibir mensajes
relay.on('relay', (data) => {
  if (data.tipo === 'mensaje') {
    console.log(`${data.usuario}: ${data.texto}`);
  }
});
```

## 🎯 Destinos disponibles

| Método | Destino | Descripción |
|--------|---------|-------------|
| `enviarAMi()` | `yo` | Solo al emisor |
| `enviarAOtros()` | `ustedes` | A todos menos el emisor |
| `enviarATodos()` | `nosotros` | A todos incluyendo el emisor |

## 📁 Estructura

```
├── index.html      # Interfaz del chat
├── conector.js     # Cliente Relay para navegador
├── package.json
└── README.md
```

## 🔗 Enlaces

- [Relay Gateway](https://github.com/NeftaliYagua/Relay)
- [Documentación](https://neftaliyagua.github.io/Relay/)
- [Otros ejemplos](https://github.com/Coderic?q=relay-ejemplo)

## 📄 Licencia

MIT © [NeftaliYagua](https://github.com/NeftaliYagua)

