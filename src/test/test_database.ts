/// <reference path="../../typings/index.d.ts" />
"use strict";
import * as Promise from "bluebird"
// set env constiables
const user = "user"
const pass = "12345mypaswword"

process.env.GAR_USERNAME = user
process.env.GAR_PASSWORD = pass

// import the moongoose helper utilities
const should = require("chai").should()
import * as db from "../database"


describe("Database Handler", function () {
  const database = new db.Database("measurement_test")
  const j  = 0
  // get authentication token
  before(function(done){
    const values = []
    for (let i = 0; i < 10; i++) {
        values.push(i)
    }
    const insertions = values.map((data)=>{return database.addRecord(data,"humidity")})
    Promise.all(insertions).then(
      (results) => {
        done()
    }
  )
  })
 //... previous te
 it("should return an array of values", function (done) {
   database.getRecord("humidity",100).then(
     (data : any) => {
       const records = data.values
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
