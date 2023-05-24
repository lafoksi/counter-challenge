// server.js
const express = require('express');
const { createServer } = require('http');

const app = express();
const server = createServer(app);

// Define the initial count
let count = 0;

// Handle JSON-RPC requests
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.post('/rpc', (req, res) => {
  const { jsonrpc, method, id } = req.body;

  if (jsonrpc !== '2.0' || !method || typeof method !== 'string') {
    const errorResponse = {
      jsonrpc: '2.0',
      error: {
        code: -32600,
        message: 'Invalid Request',
      },
      id: null,
    };
    res.status(400).json(errorResponse);
    return;
  }

  try {
    let result;
    if (method === 'increment') {
      count++;
      result = count;
    } else if (method === 'decrement') {
      count--;
      result = count;
    } else if (method === 'reset') {
        count = 0;
        result = count;
    }else {
      const errorResponse = {
        jsonrpc: '2.0',
        error: {
          code: -32601,
          message: 'Method not found',
        },
        id: id || null,
      };
      res.status(404).json(errorResponse);
      return;
    }

    const successResponse = {
      jsonrpc: '2.0',
      result,
      id: id || null,
    };
    res.json(successResponse);
  } catch (error) {
    console.error(error);
    const errorResponse = {
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Server error',
      },
      id: id || null,
    };
    res.status(500).json(errorResponse);
  }
});
app.post('/radius', (req, res) => {
  const { jsonrpc, method, id, params } = req.body;

  if (jsonrpc !== '2.0' || !method || typeof method !== 'string') {
    const errorResponse = {
      jsonrpc: '2.0',
      error: {
        code: -32600,
        message: 'Invalid Request',
      },
      id: null,
    };
    res.status(400).json(errorResponse);
    return;
  }

  try {
    let result;
    if (method === 'set_radius') {

      result = params;
    } else {
      const errorResponse = {
        jsonrpc: '2.0',
        error: {
          code: -32601,
          message: 'Method not found',
        },
        id: id || null,
      };
      res.status(404).json(errorResponse);
      return;
    }

    const successResponse = {
      jsonrpc: '2.0',
      result,
      id: id || null,
    };
    res.json(successResponse);
  } catch (error) {
    console.error(error);
    const errorResponse = {
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Server error',
      },
      id: id || null,
    };
    res.status(500).json(errorResponse);
  }
});
// Start the server
const port = 3300;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
