const asyncHandler = require("express-async-handler");
const multer = require("multer");
const path = require("node:path");
const { exec } = require("node:child_process");
const socket = require("../sockets/socket");
const Deployments = require("../models/deployment");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.body.id;
    const uploadPath = path.join(__dirname, "../users", userId);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const userProvidedName = req.body.appname;
    const fileExtension = path.extname(file.originalname);
    cb(null, userProvidedName + fileExtension);
  },
});

const upload = multer({ storage: storage });

const uploadMiddleware = upload.single("zipFile");

exports.deploymentsPost = [
  uploadMiddleware,
  asyncHandler(async (req, res) => {
    const id = req.body.id;
    const file = req.file;
    let logs = []

    if (!file) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    const appDeployemnt = new Deployments({
      app_name: req.body.appname,
      userId: req.body.id,
      status: "pending",
    });

   const deploymentDetails =  await appDeployemnt.save();

   const deploymentId = deploymentDetails._id.toString()
   

    const pathToScript = path.join(__dirname, "../bash_scripts/deployment.sh");
    console.log(req.body.appname, file.filename)
    const pathToFile = path.join(__dirname, `../users/${id}/${req.body.appname + path.extname(file.filename)}`);
    const pathToDestination = path.join(__dirname, `../users/${id}`);
    const script = exec(`${pathToScript} ${pathToFile} ${pathToDestination}`);

    script.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
      logs.push({type:"stdout", message:data.toString()});
    });

    script.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
      socket.getIo().emit("log", `Error: ${data.toString()}`);
    });

    script.on("close", async (code) => {
      if (code !== 0) {
        console.error(`script exited with ${code}`);
        await Deployments.updateOne(
          { app_name: req.body.appname },
          { $set: { status: "Failed" } }
        );
        return res.status(500).send({ message: "Error extracting file" });
      }
     await Deployments.updateOne(
        { app_name: req.body.appname },
        { $set: { status: "Running" } }
      );
      socket.getIo().emit("log", logs)
      res
        .status(200)
        .json({message:"deployment was successful", deploymentId, userId: req.body.id});
    });
  }),
];
