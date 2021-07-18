const cors = require("cors");
// Express is for building the Rest apis
const express = require("express");
const app = express();

global.__basedir = __dirname;

var corsOptions = {
  origin: "localhost:3000"
};

// cors provides Express middleware to enable CORS with various options.
app.use(cors(corsOptions));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const initRoutes = require("./src/routes/routes");

app.use(express.urlencoded({ extended: true }));
initRoutes(app);

let port = 8080;
app.get('/', (req, res) => {
    res.send(`Server running at port:${port}`);
});
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});