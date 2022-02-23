const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')

const create = (request, response) => {
  const {
    no_bast,
    no_permintaan,
    tgl_transaksi,
    id_user,
    jenis_transaksi,
    supplier,
    perihal,
    created_by
  } = request.body

  pool.query('INSERT INTO tbl_transaksi (no_bast,no_permintaan,tgl_transaksi,id_user,jenis_transaksi,supplier,perihal,created_by) VALUES($1,$2,$3,$4,$5,$6,$7,$8)', [no_bast, no_permintaan, tgl_transaksi, id_user, jenis_transaksi, supplier, perihal, created_by], (error, results) => {

    if (error) {
      throw error
      response.status(201).send(error)
      if (error.code == '23505') {
        //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
        response.status(400).send('Duplicate data')
        return;
      }
    } else {
      // response.status(200).send({success:true,data:'Success entry new menu'})  
      pool.query('SELECT id FROM tbl_transaksi ORDER BY id DESC LIMIT 1',  (error, results) => {
          if (error) 
          {
              throw error
          }
          response.status(200).send({success:true,data: results.rows[0].id})
      })

      // response.status(200).send({
      //   success: true,
      //   data: 'data berhasil dibuat'
      // })

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


  pool.query('SELECT count(*) as total FROM tbl_transaksi where is_delete=false', (error, results) => {
    if (error) {
      throw error
    }
    //console.log(results.rows[0].total)
    res.push({
      total: results.rows[0].total
    })

    var sql = 'SELECT * FROM tbl_transaksi where is_delete=false ORDER BY id ASC'
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

  pool.query('SELECT count(*) as total FROM tbl_transaksi where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    }
    //console.log(results.rows[0].total)
    res.push({
      total: results.rows[0].total
    })

    var sql = 'SELECT * FROM tbl_transaksi where id=$1 and is_delete=false'
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

const maxID = (request, response) => {
  const noid = request.params.id;
  const {page,rows} = request.body
  var page_req = page || 1
  var rows_req = rows || 10
  var offset = (page_req - 1) * rows_req
  var res = []
  var items = []

  text = noid.split('|');

  currentYear = text[0];
  id = text[1];

  pool.query('SELECT count(*) as total FROM tbl_transaksi where id_user=$1 and tgl_transaksi::text like $2 ',[id, currentYear + '%'], (error, results) => {
    if (error) {
      throw error
    }
   //console.log(results.rows[0].total)

    items.push({rows:results.rows[0].total})
    res.push(items)
    response.status(200).send({success:true,data:res})

  })

}

const update = (request, response) => {
  const id = parseInt(request.params.id);
  const {
    no_bast,
    no_permintaan,
    tgl_transaksi,
    id_user,
    jenis_transaksi,
    supplier,
    perihal,
    updated_by
  } = request.body;
  let doc;

  pool.query('SELECT count(*) as total FROM tbl_transaksi where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    } else {
      //console.log(results.rows);
    }

  })



  pool.query('SELECT * FROM tbl_transaksi where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    }

    const update_time = new Date;
    pool.query('UPDATE tbl_transaksi SET no_bast=$1,no_permintaan=$2,tgl_transaksi=$3,updated_by=$4,id_user=$6,jenis_transaksi=$7,supplier=$8,perihal=$9 where id=$5', [no_bast, no_permintaan, tgl_transaksi, updated_by, id, id_user, jenis_transaksi, supplier, perihal], (error, results) => {
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
        pool.query('DELETE FROM tbl_transaksi_detail where id_transaksi=$1'
            , [id], (error, results) => {
                if (error) {

                    if (error.code == '23505') {
                        //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                        response.status(400).send('Duplicate data')
                        return;
                    }
                } else {
                    
                    pool.query('SELECT id FROM tbl_transaksi where id=$1 LIMIT 1', [id],  (error, results) => {
                        if (error) 
                        {
                            throw error
                        }
                        response.status(200).send({success:true,data: results.rows[0].id})
                    })
                    // response.status(200).send({ success: true, data: 'data berhasil diperbarui' })
                }

            })

        // response.status(200).send({
        //   success: true,
        //   data: 'data berhasil diperbarui'
        // })
      }

    })


  });



}

const delete_ = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query('SELECT count(*) as total FROM tbl_transaksi where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    } else {
      //console.log(results.rows);
    }

  })

  pool.query('SELECT * FROM tbl_transaksi where id=$1 and is_delete=false', [id], (error, results) => {
    if (error) {
      throw error
    }


    const deletetime = new Date;
    pool.query('UPDATE tbl_transaksi SET is_delete=$1 where id=$2', [true, id], (error, results) => {
      if (error) {

        if (error.code == '23505') {
          //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
          response.status(400).send('Duplicate data')
          return;
        }
      } else {
        pool.query('UPDATE tbl_transaksi_detail SET is_delete=$1 where id_transaksi=$2', [true, id], (error, results) => {
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
      }

    })

  });

}


module.exports = {
  create,
  read,
  read_by_id,
  maxID,
  update,
  delete_,
}