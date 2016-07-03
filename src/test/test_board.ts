/// <reference path="../../typings/index.d.ts" />
import * as test_blue from "blue-tape"
import * as test from "tape"
import {Board, BoardI} from "../board"
import SerialPort from "./mock_serial"
// let SerialPort = require('serialport')

test("Board returns a value after resquest",(t)=>{
    t.plan(1)
    const board : BoardI = new Board(SerialPort,
    (  value, type) => {
      const actual = value
      const expected = 89.7
      t.equal(actual,expected)
      t.end()
    }, (err) => {
        t.end()
      });
   board.findPort()
   .then((port)=>{
     return board.setPort(port)
   })
   .then( (response)=>{  
    board.serialPort.on("dataToDevice", function(data) {
      let string_response = "{\"value\" :"+"89.7"+",\"error\":"+"null"+"}"
      board.serialPort.writeToComputer(string_response);
    })
    board.measureSoil()}
    )
})

// Actual testing
/*describe("Board (only if avalible in port, HW in the loop)", () => {
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
*/