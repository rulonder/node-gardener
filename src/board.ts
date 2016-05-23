/// <reference path="../typings/tsd.d.ts" />
var SerialPort = require("serialport")
var _ = require("lodash")
import * as Promise from "bluebird"

export interface BoardI {
  measureSoil: Function
  openValve: Function
  closeValve: Function
  setPort: Function
  getPort: Function
  measureEnv: Function
}

var options = {
  baudrate: 9600,
  parser: SerialPort.parsers.readline("\n")
}

export class Board implements BoardI {
  private serialPort: any
  private port: string
  private dataHandler: Function
  private errHandlerFunc: Function
  private isValveOpen: boolean

  constructor(dataHandler, errHandler) {
    this.dataHandler = dataHandler
    this.errHandlerFunc = errHandler
    this.port = null
    this.findPort()

  }

  errHandler (err) {
   // try reconnect to Port
   this.setPort(this.getPort()).catch(err =>{
     this.errHandlerFunc(err)
   })
  }

  // set the port of the board
  setPort(port: string) {
    this.port = port
    return new Promise<Object>((res, rej) => {
      try {
        this.serialPort = new SerialPort.SerialPort(this.port, options,false)
        this.serialPort.open((error) => {
          if (error) {
            rej({ error: "Invalid Port" })
          } else {
            this.serialPort.on('data', (data) => {
              this.dataParse(data)
            })
            this.serialPort.on('error', (err) => {
              this.errHandler(err)
            })
            res({ success: true })
          }
        })
      } catch (err) {
        rej({ error: "Invalid Port" })
      }
    })

  }
  // return the current port
  getPort() {
    return this.port
  }
  // find the first available port with usb in the pnpId
  findPort() {
    getPorts()
      .then((data) => {
      for (let port in data) {
        if (_.includes('USB', port.pnpId)) {
          return this.setPort(port.comName)
        }
      }
    })
      .catch((err) => {
      this.port = null
    })
  }
  // parse the receved data
  dataParse(data) {
    try {
      var data = JSON.parse(data)
      if (data.error != 0) throw "invalid record"
      var value: number = data.value
      var type: string = data.type
      this.dataHandler(value, type)
    } catch (err) {
      this.errHandler(err)
    }
  }
  // measure soil humidity
  measureSoil() {
    this.serialPort.write("r", (err, results) => {
      if (err) {
        this.errHandler(err)
      }
    })
  }
  // measure enviroment temp & humidity
  measureEnv() {
    this.serialPort.write("e", (err, results) => {
      if (err) {
        this.errHandler(err)
      }
    })
  }
  // open valve
  openValve() {
    this.serialPort.write("o", (err, results) => {
      console.log('err ' + err);
      console.log('results ' + results);
    })
  }
  // close valve
  closeValve() {
    this.serialPort.write("c", (err, results) => {
      console.log('err ' + err);
      console.log('results ' + results);
    })
  }
}

export function getPorts() {
  return new Promise<[Object]>((res, rej) => {
    SerialPort.list((err, ports) => {
      if (err) rej("No ports available")
      else res(ports)
    })
  })
}
