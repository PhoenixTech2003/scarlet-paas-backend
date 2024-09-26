require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoute")
const cors = require("cors")
const webhhooksRouter = require("./routes/webhooksRoute")

const PORT = process.env.PORT || 8082

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.CONNECTION_STRING);
}

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

app.use("/users", userRouter)
app.use("/api/webhooks", webhhooksRouter)

app.listen(PORT,()=>console.log(`The app is live at http://localhost:${PORT}`))


