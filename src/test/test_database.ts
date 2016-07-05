/// <reference path="../../typings/index.d.ts" />
"use strict";
import * as Promise from "bluebird"
import * as test from "tape"
import * as moment from "moment"
import * as _ from "lodash"
const sqlite3 = require('sqlite3').verbose()
const memory_db = new sqlite3.Database(':memory:')
// set env constiables
const user = "user"
const pass = "12345mypaswword"

process.env.GAR_USERNAME = user
process.env.GAR_PASSWORD = pass

// import the moongoose helper utilities
import * as db from "../database"

let database
let start_date
test("before", function (t) {
  database = new db.Database("measurement_test",memory_db)
  database.createTable().then(()=>{
  const j  = 0
  // get authentication token

    const values = []
    for (let i = 0; i < 10; i++) {
        values.push(i)
    }
    start_date = moment()
    // remove 1 second to avoid round error with DB date comparison
    start_date.subtract({ seconds: 1});
    // load database
    const insertions = values.map((data)=>{return database.addRecord(data,"humidity")})
    Promise.each(insertions,
      (results) => {
    }).then(()=>{t.end()})
  })
})
 //... previous te
 test("should return an array of values", function (assert) {
   database.getRecord("humidity",100).then(
     (data : any) => {
       let actual
       let expected       
       const records = data.values
       expected = true
       actual = Array.isArray(records)
       assert.equal(actual,expected)       
       // check value has same date as first one
       actual = _.find(records,{"value":0})["created"]
       expected = records[0]["created"]
       assert.equal(actual,expected,"first value")
       actual = moment.utc(records[0]["created"]) >= start_date
       expected = true          
       assert.equal(actual,expected)
       actual = records[0]["type"]
       expected = "humidity"   
       assert.end()
     }
   ).catch(
     (err) =>  {
      console.log(err)
      assert.end(err)
     }
   )
 })

