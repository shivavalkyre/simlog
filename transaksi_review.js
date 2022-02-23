const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')

const create = (request, response) => {
  const {
    id_transaksi,
    id_review,
    is_adjust,
    id_user,
    is_reject,
    is_ok,
    remarks,
    created_by
  } = request.body

  pool.query('INSERT INTO tbl_transaksi_review (id_transaksi,id_review,is_adjust,id_user,is_reject,is_ok,remarks,created_by) VALUES($1,$2,$3,$4,$5,$6,$7,$8)', [id_transaksi, id_review, is_adjust, id_user, is_reject, is_ok, remarks, created_by], (error, results) => {

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


  pool.query('SELECT count(*) as total FROM tbl_transaksi_review where is_delete=false', (error, results) => {
    if (error) {
      throw error
    }
    //console.log(results.rows[0].total)
    res.push({
      total: results.rows[0].total
    })

    var sql = 'SELECT * FROM tbl_transaksi_review where is_delete=false ORDER BY id ASC'
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

  pool.query('SELECT count(*) as total FROM tbl_transaksi_review where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    }
    //console.log(results.rows[0].total)
    res.push({
      total: results.rows[0].total
    })

    var sql = 'SELECT * FROM tbl_transaksi_review where id=$1 and is_delete=false'
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
    id_transaksi,
    id_review,
    is_adjust,
    id_user,
    is_reject,
    is_ok,
    remarks,
    updated_by
  } = request.body;
  let doc;

  pool.query('SELECT count(*) as total FROM tbl_transaksi_review where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    } else {
      //console.log(results.rows);
    }

  })



  pool.query('SELECT * FROM tbl_transaksi_review where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    }

    const update_time = new Date;
    pool.query('UPDATE tbl_transaksi_review SET id_transaksi=$1,id_review=$2,is_adjust=$3,updated_by=$4,id_user=$6,is_reject=$7,is_ok=$8,remarks=$9 where id=$5', [id_transaksi, id_review, is_adjust, updated_by, id, id_user, is_reject, is_ok, remarks], (error, results) => {
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
  pool.query('SELECT count(*) as total FROM tbl_transaksi_review where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    } else {
      //console.log(results.rows);
    }

  })

  pool.query('SELECT * FROM tbl_transaksi_review where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    }


    const deletetime = new Date;
    pool.query('UPDATE tbl_transaksi_review SET is_delete=$1 where id=$2', [true, id], (error, results) => {
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
  update,
  delete_,
}