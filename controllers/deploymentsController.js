const asyncHandler = require("express-async-handler");
const multer = require("multer");
const path = require("node:path");

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

    res.status(200).send({ message: "File uploaded successfully", file: file });
  }),
];
