/// <reference path="../typings/tsd.d.ts" />
/** http://stackoverflow.com/a/14015883/1015046 **/
import * as crypto from 'crypto'
import * as Promise from "bluebird"
import * as jwt from 'jsonwebtoken'

var shasum = crypto.createHash('sha256')

var SECRET= process.env.GAR_SECRET || "ThisIsAJokegdlufiwswqusoiqwu8ed7wq98"
var USER = process.env.GAR_USERNAME || "user"
var PASSWORD = process.env.GAR_PASSWORD || "1234"

class UserHandler {
    constructor () {}

    login (username : string , password : string) {
      return new Promise((resolve,reject)=>{
        if (this.isValidUser(username,password)) {
          var user = {
            "name" : username
          }
          var token = jwt.sign(user, SECRET, {
            expiresInMinutes: 1440 // expires in 24 hours
          });
          resolve({ token:token})
        } else {
          reject({error:"invalid credentials"})
        }
      })
    }

    isValidUser(user:string,pass:string) {
      return (user===USER && pass==PASSWORD)
    }

    validateUserMW(req,res,next) {
      var token = req.body.token || req.query.token || req.headers['x-access-token'];
      // validate token
      // decode token
      if (token) {

        // verifies secret and checks exp
        jwt.verify(token, SECRET, function(err, decoded) {
          if (err) {
            return res.status(401).json({ success: false, message: 'Failed to authenticate' });
          } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;
            next();
          }
        });

      } else {
            // if there is no token
        // return an error
        return res.status(401).json({ success: false, message: 'Failed to authenticate' })
      }

    }
}

var user = new UserHandler()
export default user
