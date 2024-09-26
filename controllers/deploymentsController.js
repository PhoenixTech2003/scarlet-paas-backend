const asyncHandler = require("express-async-handler");
const multer = require("multer");
const path = require("node:path");
const {exec} = require("node:child_process")
const socket= require('../sockets/socket')

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

    if (!file) {
      return res.status(400).send({ message: "No file uploaded" });
    }
    const pathToScript = path.join(__dirname,"../bash_scripts/deployment.sh")
    const pathToFile = path.join(__dirname,`../users/${id}/${file.filename}`)
    const pathToDestination = path.join(__dirname, `../users/${id}`)
    const script = exec(`${pathToScript} ${pathToFile} ${pathToDestination}`)
    
    script.stdout.on('data',(data) =>{
      console.log(`stdout: ${data}`)
      socket.getIo().emit('log', data.toString())
    })

    script.stderr.on('data',(data)=>{
      console.error(`stderr: ${data}`)
      socket.getIo().emit('log',`Error: ${data.toString()}`)
    })

    script.on('close',(code)=>{
        if(code !==0){
          console.error(`script exited with ${code}`)
          return res.status(500).send({message: "Error extracting file"})
        }

        res.status(200).send({message: "file upload and extracted successfully"})
    })


    
  }),
];
