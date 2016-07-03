import * as SerialPort from 'virtual-serialport'

interface SerialPortI {
    SerialPort : any,
    list : any,
    parsers : any
}

// let SerialPort = require('serialport')
const serialport: SerialPortI ={
    SerialPort:SerialPort,
// mock SerialPort list function
    list : (cb) => {
  const fake_ports = [ { comName: '/dev/cu.Bluetooth-Incoming-Port',
    manufacturer: undefined,
    serialNumber: undefined,
    pnpId: undefined,
    locationId: undefined,
    vendorId: undefined,
    productId: undefined },
  { comName: '/dev/cu.wchusbserial12240',
    manufacturer: undefined,
    serialNumber: undefined,
    pnpId: undefined,
    locationId: '0x12240000',
    vendorId: '0x1a26',
    productId: '0x7223' } ]
   cb(null, fake_ports)
    },
    parsers : {
  	  raw :()=>{},
      readline : ()=>{}
    }
}

export default serialport