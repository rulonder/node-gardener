/// <reference path="../typings/tsd.d.ts" />
// load modules
import * as express  from 'express'
import * as garden from './gardener'
//import * as Gardener   from 'gardener';
import * as db from "./database"

var database = new db.Database()

var gardener = new garden.Gardener(database)
gardener.init() 
// ROUTES FOR OUR API
// =============================================================================
export var router : express.Router = express.Router(); // get an instance of the express Router
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/measurements/:type',  (req  , res ) => {
    gardener.getState( req.params.type).then((data) => {
        console.log(data)
        return res.json(data)
      })
});

router.post('/measurements',  (req  , res ) => {
    gardener.addRecord(req.body.value,req.body.type).then((data) => {
        console.log(data)
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

router.post('/valve/open', (req: express.Request,res: express.Response) =>{
  return res.json(gardener.openValve())
})

router.post('/valve/close', (req: express.Request,res: express.Response) =>{
  return res.json(gardener.closeValve())
})
