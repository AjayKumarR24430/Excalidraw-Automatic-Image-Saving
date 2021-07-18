const uploadFile = require("../middleware/upload");
const fs = require('fs');

const upload = async (req, res) => {
  try {
    // use middleware function for file upload
    await uploadFile(req, res);
    // console.log("request", req.files[0].filename)
    //  return response with message
    if(req.files[0].filename== undefined){
      return res.status(400).send({ message: "Please upload a file!" });
    }
    res.status(200).send({
      message: "Uploaded the file successfully: " + req.files[0].filename,
    });
//  catch Multer error (in middleware function)
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
        return res.status(500).send({
          message: "File size cannot be larger than 2MB!",
        });
    }
    res.status(500).send({
      message: `Could not upload the file:  ${err}`,
    });
  }
};

// read all files in images folder, return list of files’ informationn (name, url)
const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/public/Images/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }
    let baseUrl = 'localhost:8080/';

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

// receives file name as input parameter, then uses Express res.download API to transfer the file at path (directory + file name) as an ‘attachment’.
const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/public/Images/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

module.exports = {
  upload,
  getListFiles,
  download,
};