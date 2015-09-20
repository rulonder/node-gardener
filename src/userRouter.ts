/// <reference path="../typings/tsd.d.ts" />
// load modules
import * as express from 'express'
import user from "./user"
import * as _ from "lodash"

// ROUTES FOR OUR API
// =============================================================================
export var router = express.Router(); // get an instance of the express Router
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.post('/login',  (req  , res ) => {
  var username :string = req.body.username;
  var password :string = req.body.password;
  user.login(username,password)
    .then((data)=>{ 
      _.extend(data,{success:true})
      return res.json(data)
    })
    .catch((data)=>{
      return res.status(401).json(data)
    })
});

export var validateUserMW = user.validateUserMW
