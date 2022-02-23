const pool = require('./dbCon');
const fs = require('fs');
const path = require('path')
const base_url = process.env.base_url;
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const res = require('express/lib/response');
var complete_path='';
var password_hash;

const create = (request, response) => {
    const { nomor_rencana,tgl_rencana,perihal,id_user,created_by } 
    = request.body

     pool.query('SELECT Count(*) as total FROM tbl_rencana_kebutuhan WHERE nomor_rencana = $1',[nomor_rencana] ,(error, results) => {
        if (error) {
          throw error
        }

        if(results.rows[0].total>0)
        {
            response.status(400).json({success:false,data: "barang sudah ada" });
           
        }else
        {
            pool.query('INSERT INTO tbl_rencana_kebutuhan (nomor_rencana,tgl_rencana,perihal,id_user,created_by) VALUES($1,$2,$3,$4,$5)',[nomor_rencana,tgl_rencana,perihal,id_user,created_by] ,(error, results) => {
              if (error) {
                  console.log(error) 
              }else{
                // response.status(200).send({success:true,data:'Success entry new menu'})  
                pool.query('SELECT id FROM tbl_rencana_kebutuhan ORDER BY id DESC LIMIT 1',  (error, results) => {
                    if (error) 
                    {
                        throw error
                    }
                    response.status(200).send({success:true,data: results.rows[0].id})
                })
              }
                // response.status(200).json({success:true,data: "Barang baru berhasil dibuat" });
            });

        }
    })

}

const read = (request, response) => {

    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []

    pool.query('SELECT count(*) as total FROM tbl_rencana_kebutuhan where is_delete=false', (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_rencana_kebutuhan where is_delete=false ORDER BY id ASC'
     pool.query(sql ,(error, results) => {
       if (error) {
         throw error
       }
       
       items.push({rows:results.rows})
       res.push(items)
       response.status(200).send({success:true,data:res})
     })
  
    })

}

const read_by_id = (request, response) => {
    const id = parseInt(request.params.id);
    const {page,rows} = request.body
    var page_req = page || 1
    var rows_req = rows || 10
    var offset = (page_req - 1) * rows_req
    var res = []
    var items = []

  
    pool.query('SELECT count(*) as total FROM tbl_rencana_kebutuhan where id=$1 and  is_delete=false',[id], (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT r.*,u.nama_lengkap FROM tbl_rencana_kebutuhan r join tbl_user u on u.id = r.id_user where r.id=$1 and r.is_delete=false ORDER BY r.id ASC'
     pool.query(sql ,[id],(error, results) => {
       if (error) {
         throw error
       }

      items.push({rows:results.rows})
      res.push(items)
      response.status(200).send({success:true,data:res})

     })
  
    })

}

const maxID = (request, response) => {
  const id = parseInt(request.params.id);
  const {page,rows} = request.body
  var page_req = page || 1
  var rows_req = rows || 10
  var offset = (page_req - 1) * rows_req
  var res = []
  var items = []


  pool.query('SELECT count(*) as total FROM tbl_rencana_kebutuhan where id_user=$1 ',[id], (error, results) => {
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
    const { nomor_rencana,tgl_rencana,perihal,id_user,updated_by} 
    = request.body

     pool.query('SELECT * FROM tbl_rencana_kebutuhan where id=$1 and is_delete=false',[id] ,(error, results) => {
        if (error) {
          throw error
        }
              
              var name;
              var complete_path;

              name = results.rows[0].foto;
              complete_path = results.rows[0].url_foto;
              if (request.files) {
                let doc = results.rows[0].foto;
                //console.log(doc);
                var doc_path = __dirname +path.join('/dokumens/barang/'+ doc);
                //console.log(doc_path);
                if(fs.existsSync(doc_path))
                {
                  fs.unlinkSync(doc_path);
                  console.log(doc_path);
                }
    
                let sampleFile = request.files.photo;
                // console.log(sampleFile);
                const now = Date.now();
                name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
                complete_path = 'http://localhost:3014/api/V1/dokumens/barang/'+name;
                console.log(complete_path);
                //console.log(__dirname);
                sampleFile.mv(path.join(__dirname + '/dokumens/barang/') + name, function (err) {
                    if (err){
                      console.log(err);
                    }
                      
                });
              }

             pool.query('UPDATE tbl_rencana_kebutuhan SET nomor_rencana=$1,tgl_rencana=$2,perihal=$3,id_user=$4,updated_by=$6 WHERE id=$5',[nomor_rencana,tgl_rencana,perihal,id_user,id,updated_by] ,(error, results) => {
                if (error) {
                    throw error
                }else{
                  pool.query('DELETE FROM tbl_rencana_kebutuhan_detail where id_rencana=$1'
                      , [id], (error, results) => {
                          if (error) {
          
                              if (error.code == '23505') {
                                  //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                                  response.status(400).send('Duplicate data')
                                  return;
                              }
                          } else {
                              // response.status(200).send({ success: true, data: 'data berhasil diperbarui' })
                          }
          
                      })
                      
                  pool.query('DELETE FROM tbl_rencana_kebutuhan_temp where id_rencana=$1'
                  , [id], (error, results) => {
                      if (error) {
      
                          if (error.code == '23505') {
                              //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                              response.status(400).send('Duplicate data')
                              return;
                          }
                      } else {
                          // response.status(200).send({ success: true, data: 'data berhasil diperbarui' })
                      }
      
                  })
                          
                  pool.query('SELECT id FROM tbl_rencana_kebutuhan where id=$1 LIMIT 1', [id],  (error, results) => {
                      if (error) 
                      {
                          throw error
                      }
                      response.status(200).send({success:true,data: results.rows[0].id})
                  })
                }
                // response.status(200).json({success:true,data: "Barang berhasil diperbarui" });
                
            });
           
    })


}

const delete_ = (request, response) => {
    const id = parseInt(request.params.id);

    pool.query('SELECT count(*) as total FROM tbl_rencana_kebutuhan where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }else{
            //console.log(results.rows);
        }
        
    })

     pool.query('SELECT * FROM tbl_rencana_kebutuhan where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }


         const deletetime = new Date;
         pool.query('UPDATE tbl_rencana_kebutuhan SET is_delete=$1 where id=$2'
         , [true,id], (error, results) =>{
           if (error) {

             if (error.code == '23505')
             {
                 //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                 response.status(400).send('Duplicate data')
                 return;
             }
           }else
           {
              pool.query('UPDATE tbl_rencana_kebutuhan_detail SET is_delete=$1 where id_rencana=$2'
              , [true,id], (error, results) =>{
                if (error) {
    
                  if (error.code == '23505')
                  {
                      //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                      response.status(400).send('Duplicate data')
                      return;
                  }
                }else
                {
                    // response.status(200).send({success:true,data:'data berhasil dihapus'})
                }
          
              })
              pool.query('UPDATE tbl_rencana_kebutuhan_temp SET is_delete=$1 where id_rencana=$2'
              , [true,id], (error, results) =>{
                if (error) {
    
                  if (error.code == '23505')
                  {
                      //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                      response.status(400).send('Duplicate data')
                      return;
                  }
                }else
                {
                    // response.status(200).send({success:true,data:'data berhasil dihapus'})
                }
          
              })
               response.status(200).send({success:true,data:'data berhasil dihapus'})
           }
     
         })

        });

}

const download = (request, response) => {
    const filename = request.params.filename;
    console.log(filename);
    var doc_path = __dirname +path.join('/dokumens/barang/'+ filename);
    console.log(doc_path);
    response.download(doc_path);
};

module.exports = {
    create,
     read,
    // readall,
    maxID,
    read_by_id,
    update,
    delete_,
    download,
    }