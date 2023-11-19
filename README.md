# Smart Gate Server

## Introduction

Smart Gate Server is a robust and secure server built on Node.js, leveraging a range of powerful libraries and middleware to ensure optimal performance, security, and scalability. This server is ideal for applications requiring high reliability and comprehensive data processing capabilities.

## Features

- **Express Framework**: Fast, unopinionated, minimalist web framework for Node.js.
- **Mongoose ODM**: Elegant MongoDB object modeling for Node.js.
- **Secure Authentication**: Utilizing bcrypt for hashing and jsonwebtoken for token-based authentication.
- **Rate Limiting**: Protecting against brute-force attacks with express-rate-limit.
- **Data Validation**: Using Joi to celebrate request data validity.
- **Cross-Origin Resource Sharing (CORS)**: Configured for safe and restricted resource sharing.
- **Logging**: Morgan and Winston for comprehensive request and error logging.
- **Real-time Communication**: Socket.io for bidirectional and low-latency communication.
- **Security Enhancements**: Helmet for securing HTTP headers, xss-clean for preventing XSS attacks, and express-mongo-sanitize to prevent NoSQL injections.

## Installation

Clone the repository and install dependencies:

```bash
git clone git@github.com:Longnh0303/SmartGate-Server.git
cd SmartGate-Server
npm install
```

## Configuration

Create a `.env` file in the root directory and add the necessary environment variables:

```env
# Server Port
PORT=5000

# URL Mongo Database
DB_URI="mongodb://localhost:27017/SmartGate"

# JWT
JWT_SECRET=random-string
JWT_ACCESS_EXPIRATION_DAY=1

# For registering a new admin account
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=123456a

# MQTT Broker
MQTT_HOSTNAME=localhost
MQTT_PORT=1883
MQTT_USER=admin
MQTT_PASSWORD=123456
```

Use `cross-env` for setting environment variables across different platforms.

## Running the Server

To start the server, run:

```bash
npm i -g pm2
pm2 start ecosystem.config.js
```

For development, you can use:

```bash
npm run dev
```

This will start the server with nodemon for auto-reloading on file changes.

## Socket IO v4

To use socket io:

```javascript
const { getIO } = require("./socket.service");
const io = getIO();
io.to("name_of_room").emit("name_of_event", data);
```

## License

MIT licensed
