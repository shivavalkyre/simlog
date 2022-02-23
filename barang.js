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
    const { kode_barang,nama_barang,unit,account_code,lokasi,jenis_barang,masa_pakai,satuan_masa_pakai,masa_simpan,satuan_masa_simpan,min_stock,max_stock,photo,kategori_barang,merek,spesifikasi_keterangan,tahun_pengadaan } 
    = request.body

     pool.query('SELECT Count(*) as total FROM tbl_barang WHERE account_code = $1',[account_code] ,(error, results) => {
        if (error) {
          throw error
        }
        if(results.rows[0].total>0)
        {
            response.status(400).json({success:false,data: "barang sudah ada" });
           
        }else
        {
            // barang not exist
            let name = '';
            if(request.files){
              let sampleFile = request.files.photo;
              console.log(sampleFile);
              const now = Date.now()
              name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
              console.log(name);
              complete_path = 'http://localhost:3014/api/V1/dokumens/barang/'+name;
              console.log(__dirname);
              sampleFile.mv(path.join(__dirname + '/dokumens/barang/') + name, function (err) {
                if (err)
                console.log(err);
              });
            }
            
            pool.query('INSERT INTO tbl_barang (kode_barang,nama_barang,unit,account_code,lokasi,jenis_barang,masa_pakai,masa_simpan,min_stock,max_stock,foto,url_foto,satuan_masa_pakai,satuan_masa_simpan,kategori_barang,merek,spesifikasi_keterangan,tahun_pengadaan) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)',[parseInt(kode_barang),nama_barang,unit,parseInt(account_code),parseInt(lokasi),parseInt(jenis_barang),parseInt(masa_pakai),parseInt(masa_simpan),parseInt(min_stock),parseInt(max_stock),name,complete_path,satuan_masa_pakai,satuan_masa_simpan,parseInt(kategori_barang),merek,spesifikasi_keterangan,parseInt(tahun_pengadaan)] ,(error, results) => {
              if (error) {
                  console.log(error) 
              }else{
                // response.status(200).send({success:true,data:'Success entry new menu'})  
                pool.query('SELECT id FROM tbl_barang ORDER BY id DESC LIMIT 1',  (error, results) => {
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

    pool.query('SELECT count(*) as total FROM tbl_barang where is_delete=false', (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT b.*,k.nama_kategori,s.nama_satuan FROM tbl_barang b left join tbl_kategori_barang k on k.id = b.kategori_barang left join tbl_satuan s on s.id = b.unit where b.is_delete=false ORDER BY b.id ASC'
     pool.query(sql ,(error, results) => {
       if (error) {
         throw error
       }
       
       var sql_stk= 'SELECT * FROM tbl_saldo_awal where is_delete=false ORDER BY tgl_saldo ASC '
       pool.query(sql_stk ,(error, results_stk) => {
         if (error) {
           throw error
         }

        let currentYear = new Date().getFullYear();
        var sql_td= 'SELECT t.* FROM tbl_rencana_kebutuhan_detail t join tbl_rencana_kebutuhan d on d.id = t.id_rencana where t.is_delete=false and d.tgl_rencana::text like $1 '
        pool.query(sql_td ,[(currentYear+1) + '%'],(error, results_rencana) => {
           if (error) {
             throw error
           }
  
           items.push({saldo_awal:results_stk.rows})
  
           items.push({rows:results.rows})
  
           items.push({kebutuhan:results_rencana.rows})
           
           res.push(items)
           response.status(200).send({success:true,data:res})
         })
         
       })

      //  items.push({rows:results.rows})
      //  res.push(items)
      //  response.status(200).send({success:true,data:res})
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

  
    pool.query('SELECT count(*) as total FROM tbl_barang where id=$1 and  is_delete=false',[id], (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT b.*,k.nama_kategori,s.nama_satuan FROM tbl_barang b left join tbl_kategori_barang k on k.id = b.kategori_barang left join tbl_satuan s on s.id = b.unit where b.id=$1 and b.is_delete=false ORDER BY b.id ASC'
     pool.query(sql ,[id],(error, results) => {
       if (error) {
         throw error
       }


        var sql_stk= 'SELECT b.qty, b.unit_price FROM tbl_saldo_awal b where b.id_barang=$1 and b.is_delete=false ORDER BY b.tgl_saldo DESC limit 1'
        pool.query(sql_stk ,[id],(error, results_stk) => {
          if (error) {
            throw error
          }

          let currentYear = new Date().getFullYear();
          // console.log(currentYear);
          var sql_td= 'SELECT sum(t.qty) as qty FROM tbl_transaksi_detail t join tbl_transaksi d on d.id = t.id_transaksi where t.id_barang=$2 and t.is_delete=false and d.tgl_transaksi::text like $1 '
          pool.query(sql_td ,[currentYear + '%',id],(error, results_td) => {
            if (error) {
              throw error
            }
  
            items.push({saldo_awal:results_stk.rows})
  
            items.push({rows:results.rows})

            items.push({stok_minta:results_td.rows})

            res.push(items)
            response.status(200).send({success:true,data:res})
          })
          
        })

     })
  
    })

}

const update = (request, response) => {
    const id = parseInt(request.params.id);
    const { kode_barang,nama_barang,unit,account_code,lokasi,jenis_barang,masa_pakai,masa_simpan,min_stock,max_stock,photo,satuan_masa_pakai,satuan_masa_simpan,kategori_barang,merek,spesifikasi_keterangan,tahun_pengadaan } 
    = request.body

     pool.query('SELECT * FROM tbl_barang where id=$1 and is_delete=false',[id] ,(error, results) => {
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

             pool.query('UPDATE tbl_barang SET kode_barang=$1,nama_barang=$2,unit=$3,account_code=$4,lokasi=$5,jenis_barang=$6,masa_pakai=$7,masa_simpan=$8,min_stock=$9,max_stock=$10,foto=$11,url_foto=$12,satuan_masa_pakai=$13,satuan_masa_simpan=$14,kategori_barang=$15,merek=$16,spesifikasi_keterangan=$17,tahun_pengadaan=$18 WHERE id=$19',[kode_barang,nama_barang,unit,account_code,lokasi,jenis_barang,masa_pakai,masa_simpan,min_stock,max_stock,name,complete_path,satuan_masa_pakai,satuan_masa_simpan,kategori_barang,merek,spesifikasi_keterangan,tahun_pengadaan,id] ,(error, results) => {
                if (error) {
                    throw error
                }else{
                  pool.query('DELETE FROM tbl_saldo_awal where id_barang=$1'
                      , [id], (error, results) => {
                          if (error) {
          
                              if (error.code == '23505') {
                                  //console.log("\n ERROR! \n Individual with name: " + body.fname + " " + body.lname + " and phone #: " + body.phone + " is a duplicate member. \n");
                                  response.status(400).send('Duplicate data')
                                  return;
                              }
                          } else {
                              
                              pool.query('SELECT id FROM tbl_barang where id=$1 LIMIT 1', [id],  (error, results) => {
                                  if (error) 
                                  {
                                      throw error
                                  }
                                  response.status(200).send({success:true,data: results.rows[0].id})
                              })
                              // response.status(200).send({ success: true, data: 'data berhasil diperbarui' })
                          }
          
                      })
                }
                // response.status(200).json({success:true,data: "Barang berhasil diperbarui" });
                
            });
           
    })


}

const delete_ = (request, response) => {
    const id = parseInt(request.params.id);
 

    pool.query('SELECT count(*) as total FROM tbl_barang where id=$1 and is_delete=false', [id], (error, results) => {
        if (error) {
          throw error
        }else{
            //console.log(results.rows);
        }
        
    })

     pool.query('SELECT * FROM tbl_barang where id=$1 and is_delete=false',[id] ,(error, results) => {
          if (error) {
            throw error
          }


         const deletetime = new Date;
         pool.query('UPDATE tbl_barang SET is_delete=$1 where id=$2'
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
              pool.query('UPDATE tbl_saldo_awal SET is_delete=$1 where id_barang=$2'
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
                    response.status(200).send({success:true,data:'data user berhasil dihapus'})
                }
          
              })
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
    // login,
    read_by_id,
    update,
    delete_,
    download,
    }