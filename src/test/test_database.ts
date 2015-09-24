/// <reference path="../../typings/tsd.d.ts" />
'use strict';
import * as Promise from "bluebird"
// set env variables
var user = "user"
var pass = "12345mypaswword"

process.env.GAR_USERNAME = user
process.env.GAR_PASSWORD = pass

// import the moongoose helper utilities
var should = require('chai').should()
import * as db from "../database"


describe('Databse Handler', function () {
  var database = new db.Database()
  var j  = 0
  // get authentication token
  before(function(done){
    var values = []
    for (let i = 0; i < 50; i++) {
        values.push(i)
    }
    Promise.all(values.map((data)=>{database.addRecord(data,'humidity')})).then(
      (results)=>{
        console.log(results)
        done()
      }
    )
  })
 //... previous te
 it('should return an array of values', function (done) {
   console.log("Start test")
   database.getRecord("humidity").then(
     (data) => {
      console.log("Start test2")
       data.should.be.an("array")
       done()
     }
   ).catch(
     (err) =>  {
      console.log(err)
      done()
     }
   )
 })
})
