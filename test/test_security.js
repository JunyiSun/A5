'use strict';

var should = require('should');
var assert = require('assert');
var mongoose = require('mongoose');
var superagent = require('superagent');
var url = "http://localhost:3000";

//if the superagent who hasn't signin is trying to get/post to any of our webpages,
// he/she will be redirected to the authentication page
describe('Security', function(){
    it('this regular user request should redirect to \'signin\' page', function(done){
        superagent.get(url+"/regular/textbook/new").end(function(e, res){
            res.redirects[0].should.equal("http://localhost:3000/signin");
            done();
        });
    });

    it('this admin request should redirect to \'signin\' page', function(done){
        superagent.get(url+'/admin/textbook/list').end(function(e, res){
            res.redirects[0].should.equal("http://localhost:3000/signin");
            done();
        });
    });

});
