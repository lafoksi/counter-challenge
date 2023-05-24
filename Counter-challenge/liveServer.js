const WebSocket = require('ws');

// Define the initial count
let count = 0;

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 3300 });

// Store the connected WebSocket clients
const clients = new Set();

// Broadcast the updated count to all clients
const broadcastCount = (method) => {
  const response = {
    jsonrpc: '2.0',
    result: count,
    method: method,
  };
  const message = JSON.stringify(response);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

// Handle WebSocket connections
wss.on('connection', (ws) => {
  // Add the client to the set of connected clients
  clients.add(ws);

  // Handle incoming WebSocket messages
  ws.on('message', (message) => {

    const request = JSON.parse(message);

    // Process the JSON-RPC request
    if (request.method === 'increment') {
        broadcastCount('increment');
    } else if (request.method === 'decrement') {
        broadcastCount('decrement');
    } else if (request.method === 'reset') {
        broadcastCount('reset');
    }

    // Broadcast the updated count to all clients
    
  });

  // Handle WebSocket close event
  ws.on('close', () => {
    // Remove the client from the set of connected clients
    clients.delete(ws);
  });
});

console.log('Server is running on ws://localhost:3300');
