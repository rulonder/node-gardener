/// <reference path="../../typings/index.d.ts" />
"use strict";
// set env variables
const user = "user"
const pass = "12345passwordfortest"

process.env.GAR_USERNAME = user
process.env.GAR_PASSWORD = pass
process.env.NODE_ENV = "development"
// import the moongoose helper utilities
const request = require("supertest")
const should = require("chai").should()
import server from "../server"
let token

describe("Get Port Configuration", function () {
  // get authentication token
  before(function(done){
    request(server)
      .post("/users/login")
      .send({username:user,password :  pass})
      .end(function(err,res){
        token = res.body.token
        done()
      })
  })
 //... previous test
 it("should return an array given the url /api/port", function (done) {
   request(server)
     .get("/api/ports")
     .set("x-access-token", token)
     .expect("Content-Type", /application\/json/)
     .end(function (err, res) {
       should.not.exist(err)
       res.body.should.have.property("ports")
       res.body.ports.should.be.an("array")
       done()
     })
 })
 //... previous test
 it("should allow to get the current port", function (done) {
   request(server)
     .get("/api/ports/main")
     .set("x-access-token", token)
     .expect(200)
     .expect("Content-Type", /application\/json/)
     .end(function (err, res) {
       should.not.exist(err)
       res.body.should.have.property("port")
       done()
     })
  })
})

describe("Set Port Configuration", function () {
  let target_port 
  // get authentication token
  before(function(done){
    request(server)
      .post("/users/login")
      .send({username:user,password :  pass})
      .end(function(err,res){
        token = res.body.token
   request(server)
     .get("/api/ports")
     .set("x-access-token", token)
     .expect("Content-Type", /application\/json/)
     .end(function (err, res) {
       should.not.exist(err)
       target_port = res.body.ports[0].comName
       done()
     })        
      })
  })
  //... previous test
  it("should allow to set the current port", function (done) {
    request(server)
      .post("/api/ports/main")
      .set("x-access-token", token)
      .send({port:target_port})
      .expect("Content-Type", /application\/json/)
      .end(function (err, res) {
        should.not.exist(err)
        res.body.should.have.property("port")
        done()
      })
   })
})


describe("login", function () {
 //... previous test
 it("should return an error given an invalid user and pass", function (done) {
   request(server)
     .post("/users/login")
     .send({username:"user",password:"12345"})
     .expect(401)
     .expect("Content-Type", /application\/json/)
     .end((err, res) => {
       should.not.exist(err)
       res.body.should.have.property("success")
       done()} )
 })

 it("should return a token for a valid user and password", function (done) {
   request(server)
     .post("/users/login")
     .send({username:user,password:pass})
     .expect(200)
     .expect("Content-Type", /application\/json/)
     .end(function(err,res){
       res.body.should.have.property("token")
       res.body.should.have.property("success")
       done()
     })
 })

 function hasTokenAndUserInformation(res) {
   if (!("token" in res.body)) return "missing token"
   return
 }

});
