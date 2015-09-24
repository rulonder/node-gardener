/// <reference path="../typings/tsd.d.ts" />
// load modules
import * as express  from 'express'
import * as garden from './gardener'
//import * as Gardener   from 'gardener';
import * as db from "./database"

var database = new db.Database("measurements")

var gardener = new garden.Gardener(database)
// ROUTES FOR OUR API
// =============================================================================
export var router : express.Router = express.Router(); // get an instance of the express Router
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/measurements/:type',  (req  , res ) => {
    gardener.getState( req.params.type).then((data) => {
        return res.json(data)
      })
});

router.post('/measurements',  (req  , res ) => {
    gardener.addRecord(req.body.value,req.body.type).then((data) => {
        return res.json(data)
      })
});

router.get('/ports',  (req  , res ) => {
    gardener.listPorts()
    .then(function(ports){
      return res.json({"status":"ok", "ports": ports})
    })
    .catch(function(err){
      return res.status(404).json({"success":false, })
    })
})

router.get('/ports/main',  (req  , res ) => {
      return res.json({"status":"ok", "port": gardener.getPort()})
})

router.post('/ports/main',  (req  , res ) => {
    var portName:string = req.body.port
    gardener.setPort(portName)
    .then(function(port){
      return res.json({"status":"ok", "port": port})
    })
    .catch(function(err){
      return res.status(404).json({"success":false,"error":err })
    })
})


router.post('/valve/open', (req: express.Request,res: express.Response) =>{
  return res.json(gardener.openValve())
})

router.post('/valve/close', (req: express.Request,res: express.Response) =>{
  return res.json(gardener.closeValve())
})
