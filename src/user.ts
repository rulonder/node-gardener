/// <reference path="../typings/index.d.ts" />
/** http://stackoverflow.com/a/14015883/1015046 **/
import * as Promise from "bluebird"
import * as jwt from "jsonwebtoken"

const SECRET = process.env.GAR_SECRET || "ThisIsAJokegdlufiwswqusoiqwu8ed7wq98"
const USER = process.env.GAR_USERNAME || "user"
const PASSWORD = process.env.GAR_PASSWORD || "1234"

class UserHandler {
    constructor () {}

    login (username : string , password : string) {
      return new Promise((resolve, reject) => {
        if (this.isValidUser(username, password)) {
          const user = {
            "name" : username
          }
          const token = jwt.sign(user, SECRET, {
            expiresIn : 86400 // expires in 24 hours
          });
          resolve({ token: token})
        } else {
          reject({ success: false , error: "invalid credentials"})
        }
      })
    }

    isValidUser(user:string,pass:string) {
      return (user===USER && pass==PASSWORD)
    }

    validateUserMW(req, res, next) {
      const token = req.body.token || req.query.token || req.headers["x-access-token"];
      // validate token
      // decode token
      if (token) {

        // verifies secret and checks exp
        jwt.verify(token, SECRET, function(err, decoded) {
          if (err) {
            return res.status(401).json({ message: "Failed to authenticate", success: false });
          } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;
            next();
          }
        });

      } else {
            // if there is no token
        // return an error
        return res.status(401).json({ message: "Failed to authenticate", success: false  })
      }

    }
}

const user = new UserHandler()
export default user
