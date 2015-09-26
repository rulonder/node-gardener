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


describe('Database Handler', function () {
  var database = new db.Database("measurement_test")
  var j  = 0
  // get authentication token
  before(function(done){
    var values = []
    for (let i = 0; i < 10; i++) {
        values.push(i)
    }
    var insertions = values.map((data)=>{return database.addRecord(data,'humidity')})
    Promise.all(insertions).then(
      (results)=>{
        done()
    }
  )
  })
 //... previous te
 it('should return an array of values', function (done) {
   database.getRecord("humidity",100).then(
     (data:any) => {
       var records = data.values
       records.should.be.an("array")
       records[0].should.have.property("value")
       records[0].should.have.property("created")
       records[0].should.have.property("type")
       done()
     }
   ).catch(
     (err) =>  {
      console.log(err)
      done(err)
     }
   )
 })
})
