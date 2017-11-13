'use strict'

exports.response = function (err, req, res, data, next) {
  if(err){
      res.status(err.status).json({message: err.message});
  }else{
      res.status(200).json(data);
      //next();
  }
};
