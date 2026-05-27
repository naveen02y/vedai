"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io = null;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: '*', // For development. Adjust for production
            methods: ['GET', 'POST']
        }
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new Error('Socket.io has not been initialized yet! Make sure initSocket has been called.');
    }
    return io;
};
exports.getIO = getIO;
//# sourceMappingURL=socket.js.map