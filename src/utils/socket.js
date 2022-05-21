import io from 'socket.io-client';

let server = null;

function socket() {
  if (server) return server;
  server = io.connect(window.electronAPI.server());
  return server;
}

export default socket;