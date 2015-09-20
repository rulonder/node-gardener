/// <reference path="../typings/tsd.d.ts" />


import * as http from 'http'
import server from './server'

var httpServer =  http.createServer( server );
httpServer.listen(8080, ()=>{ 
	console.log('http server started')
})
