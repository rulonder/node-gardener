/// <reference path="../../typings/index.d.ts" />
import * as test from "tape"
import {Board, BoardI} from "../board"
import * as SerialPort from "serialport"
import Mock_serialPort from "./mock_serial"
// let SerialPort = require('serialport')

test("Board returns a value after resquest",(t)=>{
    t.plan(1)
    const board : BoardI = new Board(Mock_serialPort,
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


test("return am error for wrong port ", function(t) {
    t.plan(1)
    const board : BoardI = new Board(SerialPort, ( value, type) => {
      t.end()
    }, (err) => {
        t.end(err)
      });
    board.setPort("invalid").then((status) => {
      console.log("open",status)
      t.end()
    }).catch((err)=>{
      const actual = err["error"]
      const expected = "Invalid Port"
      t.equal(actual,expected)
      t.end()
    })
  })
