/// <reference path="../typings/index.d.ts" />
import * as http from 'http'
import server from './server'

const httpServer =  http.createServer( server );
httpServer.listen(8080, ()=>{ 
    console.log('http server started')
})
