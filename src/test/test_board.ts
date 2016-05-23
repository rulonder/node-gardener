/// <reference path="../../typings/tsd.d.ts" />
'use strict';
import * as Promise from "bluebird"
// import the moongoose helper utilities
var should = require('chai').should()
import {Board, BoardI, getPorts} from "../board"


describe("Board (only if avalible in port, HW in the loop)", () => {
  var count = 0
  it('return a value and a type when asked for read ', function(done) {
    var board : BoardI = new Board((value, type) => {
      value.should.be.an("number");
      type.should.be.an("string");
      count +=1
      if (count == 1){
        done()
      }
    }, (err) => {
        done(err)
      });
    board.setPort("/dev/rfcomm0").then((status) => {
      board.measureEnv()
    })
  })

  it('return am error for wrong port ', function(done) {
    var board : BoardI = new Board((value, type) => {
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
