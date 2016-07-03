/// <reference path="../../typings/index.d.ts" />
"use strict";
// set env variables
const user = "user"
const pass = "12345passwordfortest"
process.env.GAR_USERNAME = user
process.env.GAR_PASSWORD = pass
process.env.NODE_ENV = "development"
// import the moongoose helper utilities
import * as request from "supertest"
import * as test from "tape"
// lets override the serialport for testing using a mock
import SerialPort from "./mock_serial"
import * as proxyquire from 'proxyquire'
// Avoid any call to the original module
proxyquire.noCallThru() 
let foo = proxyquire('../gardenerRouter', {
  'serialport': SerialPort
});
// after the module override we can import the server
import server from "../server"
let token
let actual
let expected
test("Before", function (assert) {
  // get authentication token
    request(server)
      .post("/users/login")
      .send({username:user,password :  pass})
      .end(function(err,res){
        assert.equal(err,null)
        token = res.body.token
        assert.end()
  })
  })
 //... previous test
 test("should return an array given the url /api/port", function (assert) {
   request(server)
     .get("/api/ports")
     .set("x-access-token", token)
     .expect("Content-Type", /application\/json/)
     .end(function (err, res) {
       expected = true
       actual = Array.isArray(res.body.ports)
       assert.equal(actual,expected) 
       expected = 2
       actual = res.body.ports.length
       assert.equal(actual,expected)                
       assert.equal(err,null) 
       assert.end()
     })
 })
 //... previous test
 test("should allow to get the current port", function (assert) {
   request(server)
     .get("/api/ports/main")
     .set("x-access-token", token)
     .expect(200)
     .expect("Content-Type", /application\/json/)
     .end(function (err, res) {
       assert.equal(err,null) 
       expected = "/dev/cu.wchusbserial12240"
       actual = res.body.port
       assert.equal(actual,expected)         
       assert.end()
     })
  })

  let target_port = "/dev/cu.wchusbserial12240"
  //... previous test
  test("should allow to set the current port", function (assert) {
    request(server)
      .post("/api/ports/main")
      .set("x-access-token", token)
      .send({port:target_port})
      .expect("Content-Type", /application\/json/)
      .end(function (err, res) {
        assert.equal(err,null) 
        expected = "/dev/cu.wchusbserial12240"
        actual = res.body.port
        assert.equal(actual,expected)         
        assert.end()
      })
   })




 //... previous test
 test("should return an error given an invalid user and pass", function (assert) {
   request(server)
     .post("/users/login")
     .send({username:"user",password:"12345"})
     .expect(401)
     .expect("Content-Type", /application\/json/)
     .end((err, res) => {
        assert.equal(err,null) 
        expected = false
        actual = res.body.success
        assert.equal(actual,expected) 
       assert.end()} )
 })

 test("should return a token for a valid user and password", function (assert) {
   request(server)
     .post("/users/login")
     .send({username:user,password:pass})
     .expect(200)
     .expect("Content-Type", /application\/json/)
     .end(function(err,res){
       assert.equal(err,null)   
        expected = true
        actual = res.body.success
        assert.equal(actual,expected) 
        expected = true
        actual = res.body.token ? true : false
        assert.equal(actual,expected)                
       //res.body.should.have.property("token")
       //res.body.should.have.property("success")
       assert.end()
     })
 })

test.onFinish(() => process.exit(0));

 function hasTokenAndUserInformation(res) {
   if (!("token" in res.body)) return "missing token"
   return
 }


