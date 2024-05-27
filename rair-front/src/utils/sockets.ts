import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const socketIo = io(import.meta.env.VITE_NODE_SOCKET_URI, {
  autoConnect: false
});

const events = {
  connect: () => toast('Connected'),
  message: (msg) => {
    toast(msg);
    console.info(msg);
  }
};

Object.keys(events).forEach((event) => {
  socketIo.on(event, events[event]);
});

export default {
  nodeSocket: socketIo
};
