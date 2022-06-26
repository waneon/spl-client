import io from 'socket.io-client';

let server = null;

function socket() {
  if (server) return server;
  server = io.connect(window.electronAPI.server());
  return server;
}

function check_message(data, location) {
  if (data.status == 'ok' && data.detail.which == location) {
    return true;
  } else {
    return false;
  }
}

export { socket, check_message };
