const multer = require('multer');
const path = require('path');
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Lütfen sadece resim dosyaları yükleyin!'), false);
    }
};
const upload = multer({ storage,fileFilter, limits: { fileSize: 100 * 1024 * 1024 }, });

const deleteFile = (filePath) =>{
    fs.unlink(filePath ,(err)=>{
        if(err){
            console.error("Dosya silinirken sorun oluştu",err);
        }else{
            console.log("Dosya başarıyla silindi")
        }
    })
}

module.exports = {upload, deleteFile};