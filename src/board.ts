/// <reference path="../typings/tsd.d.ts" />
var SerialPort = require ("serialport")
import * as Promise from "bluebird"

export interface BoardI {
  measureSoil : Function
  openValve : Function
  closeValve : Function
}
 
var options = {
  baudrate :9600,
  parser: SerialPort.parsers.readline("\n")
}

export class Board implements BoardI {
  private serialPort : any
  private port : string
  private dataHandler : Function
  private isValveOpen : boolean

  constructor (dataHandler,port) {
    this.dataHandler = dataHandler
    this.port = null
    this.findPort()

  }

  setPort(port:string){
    this.port = port
    this.serialPort = new SerialPort.SerialPort(this.port,options)
    this.serialPort.on('data', (data) => {
      this.dataParse(data)
    })
  }

  getPort(){
    return this.port
  }

  findPort(){
    getPorts()
    .then((data)=>{
      for (let port in data) {
        if("USB" in port.pnpId){
        this.setPort( port.comName)
        break
        }
      }
    })
    .catch((err)=>{
      this.port = null
      console.log(err)
    })
  }
  dataParse(data){
    this.dataHandler(data)
  }
  measureSoil(){
    this.serialPort.write("r")
  }
  openValve(){
    this.serialPort.write("o")
  }
  closeValve(){
    this.serialPort.write("c")
  }
}

export function getPorts() {
  return new Promise<[Object]>((res,rej)=>{
    SerialPort.list(function(err, ports) {
     if (err) rej("No ports ")
     res(ports)
  })})
}
