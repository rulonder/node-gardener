/// <reference path="../../typings/index.d.ts" />
"use strict";
// import the moongoose helper utilities
const should = require("chai").should()
import {Board, BoardI} from "../board"
let SerialPort2 = require('virtual-serialport')
let SerialPort = require('serialport')
// mock SerialPort list function
SerialPort2.list = (cb) => {
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

}

SerialPort2.parsers={
  raw :()=>{}
  , readline : ()=>{}
}

// Actual testing
describe("Board (only if avalible in port, HW in the loop)", () => {
  it("return a value and a type when asked for read ", function(done) {
    const board : BoardI = new Board(SerialPort,
    (  value, type) => {
      value.should.be.an("number");
      type.should.be.an("string");
      done()
    }, (err) => {
        done(err)
      });
   board.findPort().then( (response)=>{  
    //SerialPort.on("dataToDevice", function(data) {
    //  let string_response = "{\"value\" :"+"89.7"+",\"error\":"+"null"+"}"
    //  SerialPort.writeToComputer(string_response);
    //})
    console.log("REQUEST MEAS")
    board.measureSoil()}
    ).catch((err)=> done(err))
  })

  it("return am error for wrong port ", function(done) {
    const board : BoardI = new Board(SerialPort, ( value, type) => {
      done()
    }, (err) => {
        done(err)
      });
    board.setPort("invalid").then((status) => {
      console.log("open",status)
      board.measureEnv()
      done("invalid")
    }).catch((err)=>{
      err["error"].should.be.equal( "Invalid Port" )
      done()
    })
  })

})
