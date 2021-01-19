'use strict'

const chai = require('chai');
const chaiHTTP = require('chai-http');

const server = require('../app');
const Users = require("../models/users");

const should = chai.should();
chai.use(chaiHTTP);

describe('users', function () {
    Users.collection.drop();
    beforeEach(function (done) {
        let user = new Users({
            title: "belajar TDD"
        });

        user.save(function (err) {
            done();
        })
    });

    afterEach(function (done) {
        Users.collection.drop();
        done();
    });

    it('seharusnya menambahkan satu user dengan metode POST', function(done) {
        chai.request(server)
        .post('/api/users/register')
        .send({'email': 'dwikiramadhan73@gmail.com', 'password':'1234', 'retypepassword':'1234'})
        .end(function(err, res){
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('email');
          res.body.should.have.property('password');
          res.body.should.have.property('retypepassword');
          res.body.should.have.property('_id');
          res.body.email.should.equal('dwikiramadhan73@gmail.com');
          res.body.password.should.equal('1234');
          res.body.retypepassword.should.equal('1234');
          res.body.complete.should.equal(false);
          done();
        });
      });
})