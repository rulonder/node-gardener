/// <reference path="../typings/index.d.ts" />
import * as _ from "lodash"
import * as Promise from "bluebird"

let REG_has_usb : RegExp = /(usb|USB)/

export interface BoardI {
  measureSoil: Function
  openValve: Function
  closeValve: Function
  setPort: Function
  getPort: Function
  measureEnv: Function
  serialPort : any
  findPort : Function
}

export interface PortI {
  comName : String
}

export class Board implements BoardI {
  public serialPort: any
  private port: string
  private isValveOpen: boolean

  constructor (public serialHandler ,private dataHandler: Function,private errHandlerFunc: Function) {
    this.port = null
  }

  reconnect (err) {
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
        var options = {
          baudrate: 9600,
          parser: this.serialHandler.parsers.readline("\n")
        }        
        this.serialPort = new this.serialHandler.SerialPort(port, options,false)
        this.serialPort.open( (error) => {
          if (error) {
            rej({ error: "Invalid Port" })
          } else {
            this.serialPort.on('data', (data) => {
              this.dataParse(data)
            })
            this.serialPort.on('error', (err) => {
              this.reconnect(err)
            })
            res({ success: true })
          }
        })
      } catch (err) {
        console.log(err)
        rej({ error: "Error configuring Port" })
      }
    })

  }
  // return the current port
  getPort() {
    return this.port
  }
  // find the first available port with usb in the pnpId
  findPort () {
    return getPorts(this.serialHandler)
      .then((data) => {
      for (let port_data in data) {
        if ( data[port_data].comName.match(REG_has_usb)) {
          return data[port_data].comName
        }
      }
      throw "No valid port";
    }).catch((err) => {
      this.port = null
    })
  }
  // parse the receved data
  dataParse(data) {
    try {
      var data = JSON.parse(data)
      if (data.error ) throw "invalid record"
      var value: number = data.value
      var type: string = data.type
      this.dataHandler(value, type)
    } catch (err) {
      this.errHandlerFunc(err)
    }
  }
  // measure soil humidity
  measureSoil() {
    this.serialPort.write("r", (err, results) => {
      if (err) {
        this.errHandlerFunc(err)
      }
    })
  }
  // measure enviroment temp & humidity
  measureEnv() {
    this.serialPort.write("e", (err, results) => {
      if (err) {
        this.errHandlerFunc(err)
      }
    })
  }
  // open valve
  openValve() {
    this.serialPort.write("p", (err, results) => {
      if (err) {
        this.errHandlerFunc(err)
      }
    })
  }
}

export function getPorts( serialHandler ) {
  return new Promise<[PortI]>((res, rej) => {
    serialHandler.list((err, ports) => {
      if (err) {rej("No ports available")
    } else {res(ports)}
    })
  })
}
