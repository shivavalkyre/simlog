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
    const { kode_barang,nama_barang,unit,account_code,lokasi,jenis_barang,masa_pakai,satuan_masa_pakai,masa_simpan,satuan_masa_simpan,min_stock,max_stock,photo } 
    = request.body


    

     pool.query('SELECT Count(*) as total FROM tbl_barang WHERE kode_barang = $1',[kode_barang] ,(error, results) => {
        if (error) {
          throw error
        }
        if(results.rows[0].total>0)
        {
            response.status(400).json({success:false,data: "barang sudah ada" });
           
        }else
        {
            // barang not exist
            let sampleFile = request.files.photo;
            console.log(sampleFile);
            const now = Date.now()
            let name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
            console.log(name);
            complete_path = 'http://localhost:3014/api/V1/dokumens/barang/'+name;
            console.log(__dirname);
            sampleFile.mv(path.join(__dirname + '/dokumens/barang/') + name, function (err) {
                if (err)
                    console.log(err);
            });


                     pool.query('INSERT INTO tbl_barang (kode_barang,nama_barang,unit,account_code,lokasi,jenis_barang,masa_pakai,masa_simpan,min_stock,max_stock,foto,url_foto,satuan_masa_pakai,satuan_masa_simpan) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)',[kode_barang,nama_barang,unit,account_code,lokasi,jenis_barang,masa_pakai,masa_simpan,min_stock,max_stock,name,complete_path,satuan_masa_pakai,satuan_masa_simpan] ,(error, results) => {
                    if (error) {
                        throw error
                    }
                    response.status(200).json({success:true,data: "Barang baru berhasil dibuat" });
                    
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
  
     var sql= 'SELECT * FROM tbl_barang where is_delete=false ORDER BY id ASC'
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

  
    pool.query('SELECT count(*) as total FROM tbl_barang where id=$1 and  is_delete=false',[id], (error, results) => {
      if (error) {
        throw error
      }
     //console.log(results.rows[0].total)
     res.push({total:results.rows[0].total})
  
     var sql= 'SELECT * FROM tbl_barang where id=$1 and is_delete=false ORDER BY id ASC'
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



const update = (request, response) => {
    const id = parseInt(request.params.id);
    const { kode_barang,nama_barang,unit,account_code,lokasi,jenis_barang,masa_pakai,masa_simpan,min_stock,max_stock,photo,satuan_masa_pakai,satuan_masa_simpan } 
    = request.body


    

     pool.query('SELECT Count(*) as total FROM tbl_barang WHERE id = $1',[id] ,(error, results) => {
        if (error) {
          throw error
        }
        if(results.rows[0].total>0)
        {
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
           //  console.log(sampleFile);
              const now = Date.now();
              let name = now + '_' + sampleFile['name'].replace(/\s+/g, '')
              complete_path = 'http://localhost:3014/api/V1/dokumens/barang/'+name;
              console.log(complete_path);
   
           //   //console.log(__dirname);
              sampleFile.mv(path.join(__dirname + '/dokumens/barang/') + name, function (err) {
                  if (err){
                    console.log(err);
                  }
                     
             });
             pool.query('UPDATE tbl_barang SET kode_barang=$1,nama_barang=$2,unit=$3,account_code=$4,lokasi=$5,jenis_barang=$6,masa_pakai=$7,masa_simpan=$8,min_stock=$9,max_stock=$10,foto=$11,url_foto=$12,satuan_masa_pakai=$13,satuan_masa_simpan=$14 WHERE id=$15',[kode_barang,nama_barang,unit,account_code,lokasi,jenis_barang,masa_pakai,masa_simpan,min_stock,max_stock,name,complete_path,satuan_masa_pakai,satuan_masa_simpan,id] ,(error, results) => {
                if (error) {
                    throw error
                }
                response.status(200).json({success:true,data: "Barang berhasil diperbarui" });
                
            });
           
        }else
        {
            response.status(400).json({success:false,data: "barang tidak ada" });
        }
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
               response.status(200).send({success:true,data:'data user berhasil dihapus'})
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