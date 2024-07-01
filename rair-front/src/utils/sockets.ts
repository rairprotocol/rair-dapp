import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const socketIo = io(import.meta.env.VITE_NODE_SOCKET_URI, {
  autoConnect: false,
  reconnectionDelay: 10000,
  reconnectionDelayMax: 20000
});

const events = {
  message: (socketData) => {
    const { message, data = [] } = socketData;
    toast(message);
  }
};

Object.keys(events).forEach((event) => {
  socketIo.on(event, events[event]);
});

export default {
  nodeSocket: socketIo
};
