/// <reference path="../typings/index.d.ts" />
// load modules
import * as express  from "express"
import * as garden from "./gardener"
//import * as Gardener   from "gardener";
import * as db from "./database"
import * as Serialport from "serialport"

const database = new db.Database("measurements")
database.createTable().catch((err)=>{console.log(err)})

const gardener = new garden.Gardener(database, Serialport)
// ROUTES FOR OUR API
// =============================================================================
export const router : express.Router = express.Router(); // get an instance of the express Router
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get("/measurements/:type",  (req  , res ) => {
    gardener.getState( req.params.type).then((data) => {
        return res.json(data)
      })
});


router.get("/ports",  (req  , res ) => {
    gardener.listPorts(Serialport)
    .then(function(ports){
      return res.json({"success":true, "ports": ports})
    })
    .catch(function(err){
      return res.status(404).json({"success":false, })
    })
})

router.get("/ports/main",  (req  , res ) => {
      return res.json({"success":true, "port": gardener.getPort()})
})

router.post("/ports/main",  (req  , res ) => {
    const portName:string = req.body.port
    gardener.setPort(portName)
    .then(function(port){
      return res.json({"success":true, "port": port})
    })
    .catch(function(err){
      return res.status(404).json({"success":false,"error":err })
    })
})

router.get("/valve/close", (req: express.Request,res: express.Response) =>{
  return res.json(gardener.closeValve())
})

router.get("/valve/open", (req: express.Request,res: express.Response) =>{
  return res.json(gardener.openValve())
})

