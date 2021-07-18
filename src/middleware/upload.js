const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
    // determines folder to store the uploaded files.
  destination: (req, file, cb) => {
    cb(null, __basedir + "/public/Images/");
  },
   //determines the name of the file inside the destination folder.
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
// We can add limits: { fileSize: maxSize } to the object passed to multer() to restrict file size.
  limits: { fileSize: maxSize },
}).any();

//util.promisify() makes the exported middleware object can be used with async-await.
let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;