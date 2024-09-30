require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoute")
const cors = require("cors")
const webhhooksRouter = require("./routes/webhooksRoute")
const deploymentsRouter = require("./routes/deploymentsRoute")
const {createServer} = require("node:http")
const  socket = require('./sockets/socket')

const PORT = process.env.PORT || 8082

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.CONNECTION_STRING);
}

const app = express();
const server = createServer(app)
const io = socket.init(server)

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

app.use("/users", userRouter)
app.use("/api/webhooks", webhhooksRouter)
app.use("/deployments", deploymentsRouter)



io.on('connection', (socket)=>{
  console.log('client connected')
  socket.serverOffset = socket.handshake.auth.serverOffset || 0
  
  socket.on('disconnect', ()=>{
    console.log('client disconnected')
    
  })
  
})

server.listen(PORT,()=>console.log(`The app is live at http://localhost:${PORT}`))


