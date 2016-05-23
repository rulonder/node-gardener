/// <reference path="../typings/tsd.d.ts" />
// call the packages we need
import * as express    from "express"               // call express
import * as bodyParser from "body-parser"
import * as router     from "./gardenerRouter"
import * as useroruter from "./userRouter"

var app = express()                 // define our app using express

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))

var port : number = process.env.PORT || 8080       // set our port

// more routes for our API will happen here
// let TODO
// rEGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', useroruter.validateUserMW)
app.use('/api', router.router)
app.use('/users',useroruter.router)
app.use('/',express.static(__dirname+'/static'))

export default app
