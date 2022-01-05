const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors");
const logger = require('morgan');
const path = require('path');
const fileUpload = require("express-fileupload");
const jwt = require('jsonwebtoken');


const user = require ('./user');
const barang = require ('./barang');

require('dotenv').config();
const PORT = process.env.PORT || 3014;
const base_url = process.env.base_url;

const app = express();
app.use(fileUpload());
app.use(express.json())// add this line
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())


app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin','*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    // Pass to next layer of middleware
    next();
  });

app.use(cors())
app.use(logger('dev'));
app.use(express.json({
    limit: '50mb'
}));
app.use(express.urlencoded({
    extended: true,
    parameterLimit: 100000,
    limit: '50mb'
}));



// =============================== USER =====================================
app.post('/api/V1/simlog/user', user.create);

app.get('/api/V1/simlog/user/all', user.readall);
app.put('/api/V1/simlog/user/:id',authenticateToken, (req, res) => {
    user.update(req,res)
});
app.delete('/api/V1/simlog/user/:id',authenticateToken, (req, res) => {
    user.delete_(req,res)
});
// ==========================================================================
// =============================== LOGIN USER ===============================
app.post('/api/V1/simlog/user/login',user.login);
// ==========================================================================


// ================================= BARANG ============================
app.post('/api/V1/simlog/barang',authenticateToken, (req, res) => {
    barang.create(req,res);
});
app.get('/api/V1/simlog/barang', authenticateToken, (req, res) => {
    barang.read(req,res);
});
app.get('/api/V1/simlog/barang/:id', authenticateToken, (req, res) => {
    barang.read_by_id(req,res);
});
app.put('/api/V1/simlog/barang/:id', authenticateToken, (req, res) => {
    barang.update(req,res);
});

app.delete('/api/V1/simlog/barang/:id', authenticateToken, (req, res) => {
    barang.delete_(req,res);
});

app.get('/api/V1/dokumens/barang/:filename', authenticateToken, (req, res) => {

    barang.download(req,res);
});
// ==========================================================================


// authentification part======================================================

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) {
        //return res.sendStatus(401)
        return res.status(401).send({success:false,data:'Unathorize'})
    }
    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET)
      req.user = verified
  
      next() // continuamos
  } catch (error) {
      res.status(400).json({error: 'token not valid'})
  }
  
  }


// ==============================================================================

app.get("/", (req, res) => {
    res.send({
        message: "🚀 API Simlog v2.0"
    });
});

app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
});
