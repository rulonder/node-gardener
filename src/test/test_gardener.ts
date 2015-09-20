/// <reference path="../../typings/tsd.d.ts" />
'use strict';

// import the moongoose helper utilities
var request = require('supertest')
var should = require('chai').should()
import server from '../server'

describe('addition', function () {
  var token = ""
  // get authentication token
  before(function(done){
    request(server)
      .post('/users/login')
      .send({username:"user",password:"1234"})
      .end(function(err,res){
        token = res.body.token
        done()
      })
  })
 //... previous test
 it('should return an array given the url /api/port', function (done) {
   request(server)
     .get('/api/ports')
     .set('x-access-token', token)
     .expect(200)
     .expect('Content-Type', /application\/json/)
     .end(function (err, res) {
       should.not.exist(err)
       res.body.should.have.property("ports")
       res.body.ports.should.be.an("array")
       done()
     })
 })
})

var user = "user"
var pass = "12345"

describe('login', function () {
 //... previous test
 it('should return an error given an invalid user and pass', function (done) {
   request(server)
     .post('/users/login')
     .send({username:"user",password:"12345"})
     .expect(401)
     .expect('Content-Type', /application\/json/)
     .end(done)
 })

 it('should return a token for a valid user and password', function (done) {
   request(server)
     .post('/users/login')
     .send({username:"user",password:"1234"})
     .expect(200)
     .expect('Content-Type', /application\/json/)
     .end(function(err,res){
       res.body.should.have.property('token')
       res.body.should.have.property('success')
       done() 
     })
 })

 function hasTokenAndUserInformation(res) {
   if (!('token' in res.body)) return "missing token"
   return
 }

});
