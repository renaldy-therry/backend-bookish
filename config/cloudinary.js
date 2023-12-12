const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: 'dv1ub4ivc', 
  api_key: '867961632336442', 
  api_secret: 'iEOu8goIudiQZvsojZL7_kz6Ktk' ,
  secure: true
});

module.exports = cloudinary;

// tes
// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//    { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });