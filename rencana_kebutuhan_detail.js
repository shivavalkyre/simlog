const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')

const create = (request, response) => {
  const {
    id_rencana,
    id_barang,
    minta,
    qty,
    sisa,
    created_by
  } = request.body

  pool.query('INSERT INTO tbl_rencana_kebutuhan_detail (id_rencana,id_barang,minta,qty,sisa,created_by) VALUES($1,$2,$3,$4,$5,$6)', [id_rencana, id_barang, minta, qty, sisa, created_by], (error, results) => {

    if (error) {
      throw error
      response.status(201).send(error)
      if (error.code == '23505') {
        //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
        response.status(400).send('Duplicate data')
        return;
      }
    } else {
      response.status(200).send({
        success: true,
        data: 'data berhasil dibuat'
      })
    }
  })
}


const read = (request, response) => {

  const {
    page,
    rows
  } = request.body
  var page_req = page || 1
  var rows_req = rows || 10
  var offset = (page_req - 1) * rows_req
  var res = []
  var items = []


  pool.query('SELECT count(*) as total FROM tbl_rencana_kebutuhan_detail where is_delete=false', (error, results) => {
    if (error) {
      throw error
    }
    //console.log(results.rows[0].total)
    res.push({
      total: results.rows[0].total
    })

    var sql = 'SELECT * FROM tbl_rencana_kebutuhan_detail where is_delete=false ORDER BY id ASC'
    pool.query(sql, (error, results) => {
      if (error) {
        throw error
      }
      items.push({
        rows: results.rows
      })
      res.push(items)
      response.status(200).send({
        success: true,
        data: res
      })
    })

  })

}

const read_by_id = (request, response) => {

  const id = parseInt(request.params.id);
  //console.log('Here');
  //console.log(id);
  const {
    page,
    rows
  } = request.body
  var page_req = page || 1
  var rows_req = rows || 10
  var offset = (page_req - 1) * rows_req
  var res = []
  var items = []

  pool.query('SELECT count(*) as total FROM tbl_rencana_kebutuhan_detail where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    }
    //console.log(results.rows[0].total)
    res.push({
      total: results.rows[0].total
    })

    var sql = 'SELECT * FROM tbl_rencana_kebutuhan_detail where id=$1 and is_delete=false'
    pool.query(sql, [id], (error, results) => {
      if (error) {
        throw error
      }
      items.push({
        rows: results.rows
      })
      res.push(items)
      response.status(200).send({
        success: true,
        data: res
      })
    })

  })

}

const read_by_transaksi = (request, response) => {

  const id = parseInt(request.params.id);
  //console.log('Here');
  //console.log(id);
  const {
    page,
    rows
  } = request.body
  var page_req = page || 1
  var rows_req = rows || 10
  var offset = (page_req - 1) * rows_req
  var res = []
  var items = []

  pool.query('SELECT count(*) as total FROM tbl_rencana_kebutuhan_detail where id_rencana=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    }
    //console.log(results.rows[0].total)
    res.push({
      total: results.rows[0].total
    })

    var sql = 'SELECT t.qty as kebutuhan,t.id,t.minta,b.nama_barang,b.account_code,b.id as id_barang,k.nama_kategori,s.nama_satuan FROM tbl_rencana_kebutuhan_detail t left join tbl_barang b on b.id = t.id_barang left join tbl_kategori_barang k on k.id = b.kategori_barang left join tbl_satuan s on s.id = b.unit where t.id_rencana=$1 and t.is_delete=false'
    pool.query(sql, [id], (error, results) => {
      if (error) {
        throw error
      }
      
      var sql_stk= 'SELECT * FROM tbl_saldo_awal where is_delete=false ORDER BY tgl_saldo ASC '
      pool.query(sql_stk ,(error, results_stk) => {
        if (error) {
          throw error
        }

        let currentYear = new Date().getFullYear();
        // console.log(currentYear);
        var sql_td= 'SELECT * FROM tbl_transaksi_detail t join tbl_transaksi d on d.id = t.id_transaksi where t.is_delete=false and d.tgl_transaksi::text like $1 '
        pool.query(sql_td ,[currentYear + '%'],(error, results_td) => {
          if (error) {
            throw error
          }

          items.push({rows:results.rows})
          
          items.push({saldo_awal:results_stk.rows})

          items.push({stok_minta:results_td.rows})

          res.push(items)
          response.status(200).send({success:true,data:res})
        })

      })

      // items.push({ rows: results.rows })
      // res.push(items)
      // response.status(200).send({ success: true, data: res })
    })

  })

}

const read_by_barang = (request, response) => {

  const id = parseInt(request.params.id);
  //console.log('Here');
  //console.log(id);
  const {
    page,
    rows
  } = request.body
  var page_req = page || 1
  var rows_req = rows || 10
  var offset = (page_req - 1) * rows_req
  var res = []
  var items = []

  pool.query('SELECT count(*) as total FROM tbl_rencana_kebutuhan_detail where id_barang=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    }
    //console.log(results.rows[0].total)
    res.push({
      total: results.rows[0].total
    })

    var sql = 'SELECT * FROM tbl_rencana_kebutuhan_detail where id_barang=$1 and is_delete=false'
    pool.query(sql, [id], (error, results) => {
      if (error) {
        throw error
      }
      items.push({
        rows: results.rows
      })
      res.push(items)
      response.status(200).send({
        success: true,
        data: res
      })
    })

  })

}

const update = (request, response) => {
  const id = parseInt(request.params.id);
  const {
    id_rencana,
    id_barang,
    minta,
    qty,
    sisa,
    updated_by
  } = request.body;
  let doc;

  pool.query('SELECT count(*) as total FROM tbl_rencana_kebutuhan_detail where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    } else {
      //console.log(results.rows);
    }

  })



  pool.query('SELECT * FROM tbl_rencana_kebutuhan_detail where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    }

    const update_time = new Date;
    pool.query('UPDATE tbl_rencana_kebutuhan_detail SET id_rencana=$1,id_barang=$2,minta=$3,updated_by=$4,qty=$6,sisa=$7 where id=$5', [id_rencana, id_barang, minta, updated_by, id, qty, sisa], (error, results) => {
      if (error) {
        throw error
        //response.status(201).send(error)
        //console.log(error);
        if (error.code == '23505') {
          //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
          response.status(400).send('Duplicate data')
          return;
        }
      } else {
        response.status(200).send({
          success: true,
          data: 'data berhasil diperbarui'
        })
      }

    })


  });



}

const delete_ = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query('SELECT count(*) as total FROM tbl_rencana_kebutuhan_detail where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    } else {
      //console.log(results.rows);
    }

  })

  pool.query('SELECT * FROM tbl_rencana_kebutuhan_detail where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    }


    const deletetime = new Date;
    pool.query('UPDATE tbl_rencana_kebutuhan_detail SET is_delete=$1 where id=$2', [true, id], (error, results) => {
      if (error) {

        if (error.code == '23505') {
          //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
          response.status(400).send('Duplicate data')
          return;
        }
      } else {
        response.status(200).send({
          success: true,
          data: 'data berhasil dihapus'
        })
      }

    })

  });

}


module.exports = {
  create,
  read,
  read_by_id,
  read_by_transaksi,
  read_by_barang,
  update,
  delete_,
}