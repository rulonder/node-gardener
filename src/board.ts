/// <reference path="../typings/tsd.d.ts" />
var SerialPort = require ("serialport")
var _ = require("lodash")
import * as Promise from "bluebird"

export interface BoardI {
  measureSoil : Function
  openValve : Function
  closeValve : Function
  setPort: Function
  getPort: Function
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

  constructor (dataHandler) {
    this.dataHandler = dataHandler
    this.port = null
    this.findPort()

  }

  setPort(port:string){
    this.port = port
    return new Promise<Object>((res,rej)=>{
      try {
        this.serialPort = new SerialPort.SerialPort(this.port,options)
        this.serialPort.on('data', (data) => {
          this.dataParse(data)
        })
        res( { success:true } )
      } catch (err) {
        rej({error:"Invalid Port"})
      }
    })

  }

  getPort(){
    return this.port
  }
  // find the first available port with usb in the pnpId
  findPort(){
    getPorts()
    .then((data)=>{
      for (let port in data) {
        if(_.includes('USB', port.pnpId)){
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
    try{
      var data = JSON.parse(data.toString())
      var value:string = data.value
      var type :string = data.type
      this.dataHandler(value,type)
    }catch(err){
      console.log("invalid data")
    }

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
    SerialPort.list((err, ports) => {
     if (err) rej("No ports available")
     else res(ports)
  })})
}
