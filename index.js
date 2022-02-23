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
app.get('/api/V1/simlog/user/:id', user.read_by_id);
app.put('/api/V1/simlog/user/:id', user.update);
app.delete('/api/V1/simlog/user/:id', user.delete_);
app.get('/api/V1/dokumens/user/:filename', user.download);
// app.put('/api/V1/simlog/user/:id',authenticateToken, (req, res) => { user.update(req,res) });
// app.delete('/api/V1/simlog/user/:id',authenticateToken, (req, res) => { user.delete_(req,res) });
// ==========================================================================

// =============================== LOGIN USER ===============================
app.post('/api/V1/simlog/user/login',user.login);
// ==========================================================================

// ================================= BARANG ============================
// app.post('/api/V1/simlog/barang',authenticateToken, (req, res) => { barang.create(req,res); });
// app.get('/api/V1/simlog/barang', authenticateToken, (req, res) => { barang.read(req,res); });
// app.get('/api/V1/simlog/barang/:id', authenticateToken, (req, res) => { barang.read_by_id(req,res); });
// app.put('/api/V1/simlog/barang/:id', authenticateToken, (req, res) => { barang.update(req,res); });
// app.delete('/api/V1/simlog/barang/:id', authenticateToken, (req, res) => { barang.delete_(req,res); });
// app.get('/api/V1/dokumens/barang/:filename', authenticateToken, (req, res) => { barang.download(req,res); });
// ==========================================================================


// modul routing here
const kategori_barang = require('./kategori_barang');
const kode_jenis = require('./kode_jenis');
const lokasi = require('./lokasi');
const saldo_awal = require('./saldo_awal');
const satuan = require('./satuan');
const patern_approval = require('./patern_approval');
const patern_approval_detail = require('./patern_approval_detail');
const patern_review = require('./patern_review');
const patern_review_detail = require('./patern_review_detail');
const role = require('./role');
const role_modul = require('./role_modul');
const role_modul_menu = require('./role_modul_menu');
const transaksi = require('./transaksi');
const transaksi_detail = require('./transaksi_detail');
const transaksi_approval = require('./transaksi_approval');
const transaksi_review = require('./transaksi_review');
const rencana_kebutuhan = require('./rencana_kebutuhan');
const rencana_kebutuhan_detail = require('./rencana_kebutuhan_detail');
const rencana_kebutuhan_temp = require('./rencana_kebutuhan_temp');


// routing here

// ============================== Barang ================================================
app.post('/api/V1/simlog/barang', barang.create);
app.get('/api/V1/simlog/barang', barang.read);
app.get('/api/V1/simlog/barang/:id', barang.read_by_id);
app.put('/api/V1/simlog/barang/:id', barang.update);
app.delete('/api/V1/simlog/barang/:id', barang.delete_);
app.get('/api/V1/dokumens/barang/:filename', barang.download);
// ======================================================================================

// ============================== Kategori Barang =======================================
app.post('/api/V1/simlog/kategori_barang/create', kategori_barang.create);
app.get('/api/V1/simlog/kategori_barang/read', kategori_barang.read);
app.get('/api/V1/simlog/kategori_barang/:id', kategori_barang.read_by_id);
app.put('/api/V1/simlog/kategori_barang/update/:id', kategori_barang.update);
app.delete('/api/V1/simlog/kategori_barang/delete/:id', kategori_barang.delete_);
// ======================================================================================

// ============================== Jenis Barang ==========================================
app.post('/api/V1/simlog/kode_jenis/create', kode_jenis.create);
app.get('/api/V1/simlog/kode_jenis/read', kode_jenis.read);
app.get('/api/V1/simlog/kode_jenis/:id', kode_jenis.read_by_id);
app.put('/api/V1/simlog/kode_jenis/update/:id', kode_jenis.update);
app.delete('/api/V1/simlog/kode_jenis/delete/:id', kode_jenis.delete_);
// ======================================================================================

// ============================== Lokasi Barang =========================================
app.post('/api/V1/simlog/lokasi/create', lokasi.create);
app.get('/api/V1/simlog/lokasi/read', lokasi.read);
app.get('/api/V1/simlog/lokasi/:id', lokasi.read_by_id);
app.put('/api/V1/simlog/lokasi/update/:id', lokasi.update);
app.delete('/api/V1/simlog/lokasi/delete/:id', lokasi.delete_);
// ======================================================================================

// ============================== Saldo Awal ============================================
app.post('/api/V1/simlog/saldo_awal/create', saldo_awal.create);
app.get('/api/V1/simlog/saldo_awal/read', saldo_awal.read);
app.get('/api/V1/simlog/saldo_awal/:id', saldo_awal.read_by_id);
app.get('/api/V1/simlog/saldo_awal/brng/:id', saldo_awal.read_by_brng);
app.put('/api/V1/simlog/saldo_awal/update/:id', saldo_awal.update);
app.delete('/api/V1/simlog/saldo_awal/delete/:id', saldo_awal.delete_);
// ======================================================================================

// ============================== Satuan ================================================
app.post('/api/V1/simlog/satuan/create', satuan.create);
app.get('/api/V1/simlog/satuan/read', satuan.read);
app.get('/api/V1/simlog/satuan/:id', satuan.read_by_id);
app.put('/api/V1/simlog/satuan/update/:id', satuan.update);
app.delete('/api/V1/simlog/satuan/delete/:id', satuan.delete_);
// ======================================================================================

// ============================== Patern Approval =======================================
app.post('/api/V1/simlog/patern_approval/create', patern_approval.create);
app.get('/api/V1/simlog/patern_approval/read', patern_approval.read);
app.get('/api/V1/simlog/patern_approval/:id', patern_approval.read_by_id);
app.put('/api/V1/simlog/patern_approval/update/:id', patern_approval.update);
app.delete('/api/V1/simlog/patern_approval/delete/:id', patern_approval.delete_);
// ======================================================================================

// ============================== Patern Approval Detail ================================
app.post('/api/V1/simlog/patern_approval_detail/create', patern_approval_detail.create);
app.get('/api/V1/simlog/patern_approval_detail/read', patern_approval_detail.read);
app.get('/api/V1/simlog/patern_approval_detail/:id', patern_approval_detail.read_by_id);
app.put('/api/V1/simlog/patern_approval_detail/update/:id', patern_approval_detail.update);
app.delete('/api/V1/simlog/patern_approval_detail/delete/:id', patern_approval_detail.delete_);
// ======================================================================================

// ============================== Patern Review =========================================
app.post('/api/V1/simlog/patern_review/create', patern_review.create);
app.get('/api/V1/simlog/patern_review/read', patern_review.read);
app.get('/api/V1/simlog/patern_review/:id', patern_review.read_by_id);
app.put('/api/V1/simlog/patern_review/update/:id', patern_review.update);
app.delete('/api/V1/simlog/patern_review/delete/:id', patern_review.delete_);
// ======================================================================================

// ============================== Patern Review Detail ==================================
app.post('/api/V1/simlog/patern_review_detail/create', patern_review_detail.create);
app.get('/api/V1/simlog/patern_review_detail/read', patern_review_detail.read);
app.get('/api/V1/simlog/patern_review_detail/:id', patern_review_detail.read_by_id);
app.put('/api/V1/simlog/patern_review_detail/update/:id', patern_review_detail.update);
app.delete('/api/V1/simlog/patern_review_detail/delete/:id', patern_review_detail.delete_);
// ======================================================================================

// ============================== Role ==================================================
app.post('/api/V1/simlog/role/create', role.create);
app.get('/api/V1/simlog/role/read', role.read);
app.get('/api/V1/simlog/role/:id', role.read_by_id);
app.put('/api/V1/simlog/role/update/:id', role.update);
app.delete('/api/V1/simlog/role/delete/:id', role.delete_);
// ======================================================================================

// ============================== Role Modul ============================================
app.post('/api/V1/simlog/role_modul/create', role_modul.create);
app.get('/api/V1/simlog/role_modul/read', role_modul.read);
app.get('/api/V1/simlog/role_modul/:id', role_modul.read_by_id);
app.put('/api/V1/simlog/role_modul/update/:id', role_modul.update);
app.delete('/api/V1/simlog/role_modul/delete/:id', role_modul.delete_);
// ======================================================================================

// ============================== Role Modul Menu =======================================
app.post('/api/V1/simlog/role_modul_menu/create', role_modul_menu.create);
app.get('/api/V1/simlog/role_modul_menu/read', role_modul_menu.read);
app.get('/api/V1/simlog/role_modul_menu/:id', role_modul_menu.read_by_id);
app.put('/api/V1/simlog/role_modul_menu/update/:id', role_modul_menu.update);
app.delete('/api/V1/simlog/role_modul_menu/delete/:id', role_modul_menu.delete_);
// ======================================================================================

// ============================== Transaksi =============================================
app.post('/api/V1/simlog/transaksi/create', transaksi.create);
app.get('/api/V1/simlog/transaksi/read', transaksi.read);
app.get('/api/V1/simlog/transaksi/:id', transaksi.read_by_id);
app.put('/api/V1/simlog/transaksi/update/:id', transaksi.update);
app.delete('/api/V1/simlog/transaksi/delete/:id', transaksi.delete_);
// ======================================================================================

// ============================== Transaksi Detail ======================================
app.post('/api/V1/simlog/transaksi_detail/create', transaksi_detail.create);
app.get('/api/V1/simlog/transaksi_detail/read', transaksi_detail.read);
app.get('/api/V1/simlog/transaksi_detail/:id', transaksi_detail.read_by_id);
app.get('/api/V1/simlog/transaksi_detail/transaksi/:id', transaksi_detail.read_by_transaksi);
app.get('/api/V1/simlog/transaksi_detail/barang/:id', transaksi_detail.read_by_barang);
app.put('/api/V1/simlog/transaksi_detail/update/:id', transaksi_detail.update);
app.delete('/api/V1/simlog/transaksi_detail/delete/:id', transaksi_detail.delete_);
// ======================================================================================

// ============================== Transaksi Approval ====================================
app.post('/api/V1/simlog/transaksi_approval/create', transaksi_approval.create);
app.get('/api/V1/simlog/transaksi_approval/read', transaksi_approval.read);
app.get('/api/V1/simlog/transaksi_approval/:id', transaksi_approval.read_by_id);
app.put('/api/V1/simlog/transaksi_approval/update/:id', transaksi_approval.update);
app.delete('/api/V1/simlog/transaksi_approval/delete/:id', transaksi_approval.delete_);
// ======================================================================================

// ============================== Transaksi Review ======================================
app.post('/api/V1/simlog/transaksi_review/create', transaksi_review.create);
app.get('/api/V1/simlog/transaksi_review/read', transaksi_review.read);
app.get('/api/V1/simlog/transaksi_review/:id', transaksi_review.read_by_id);
app.put('/api/V1/simlog/transaksi_review/update/:id', transaksi_review.update);
app.delete('/api/V1/simlog/transaksi_review/delete/:id', transaksi_review.delete_);
// ======================================================================================

// ============================== Rencana Kebutuhan =====================================
app.post('/api/V1/simlog/rencana_kebutuhan/create', rencana_kebutuhan.create);
app.get('/api/V1/simlog/rencana_kebutuhan/read', rencana_kebutuhan.read);
app.get('/api/V1/simlog/rencana_kebutuhan/:id', rencana_kebutuhan.read_by_id);
app.get('/api/V1/simlog/rencana_kebutuhan/maxID/:id', rencana_kebutuhan.maxID);
app.put('/api/V1/simlog/rencana_kebutuhan/update/:id', rencana_kebutuhan.update);
app.delete('/api/V1/simlog/rencana_kebutuhan/delete/:id', rencana_kebutuhan.delete_);
// ======================================================================================

// ============================== Rencana Kebutuhan Detail ==============================
app.post('/api/V1/simlog/rencana_kebutuhan_detail/create', rencana_kebutuhan_detail.create);
app.get('/api/V1/simlog/rencana_kebutuhan_detail/read', rencana_kebutuhan_detail.read);
app.get('/api/V1/simlog/rencana_kebutuhan_detail/:id', rencana_kebutuhan_detail.read_by_id);
app.get('/api/V1/simlog/rencana_kebutuhan_detail/transaksi/:id', rencana_kebutuhan_detail.read_by_transaksi);
app.get('/api/V1/simlog/rencana_kebutuhan_detail/barang/:id', rencana_kebutuhan_detail.read_by_barang);
app.put('/api/V1/simlog/rencana_kebutuhan_detail/update/:id', rencana_kebutuhan_detail.update);
app.delete('/api/V1/simlog/rencana_kebutuhan_detail/delete/:id', rencana_kebutuhan_detail.delete_);
// ======================================================================================

// ============================== Rencana Kebutuhan Temp ================================
app.post('/api/V1/simlog/rencana_kebutuhan_temp/create', rencana_kebutuhan_temp.create);
app.get('/api/V1/simlog/rencana_kebutuhan_temp/read', rencana_kebutuhan_temp.read);
app.get('/api/V1/simlog/rencana_kebutuhan_temp/:id', rencana_kebutuhan_temp.read_by_id);
app.get('/api/V1/simlog/rencana_kebutuhan_temp/transaksi/:id', rencana_kebutuhan_temp.read_by_transaksi);
app.get('/api/V1/simlog/rencana_kebutuhan_temp/barang/:id', rencana_kebutuhan_temp.read_by_barang);
app.put('/api/V1/simlog/rencana_kebutuhan_temp/update/:id', rencana_kebutuhan_temp.update);
app.delete('/api/V1/simlog/rencana_kebutuhan_temp/delete/:id', rencana_kebutuhan_temp.delete_);
// ======================================================================================


// authentification part=================================================================

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


// =======================================================================================

app.get("/", (req, res) => {
    res.send({
        message: "🚀 API Simlog v2.0"
    });
});

app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
});
