const socketIo = require('socket.io')

let io;

module.exports = {
    init:(server)=>{
        io = socketIo(server, {
            cors: {
                origin: "http://localhost:5173"
            }
        })
    
        return io;
    },

    getIo: ()=>{
        if(!io){
            throw new Error('Socket.io not initialized')

        }
        return io;
    }
}