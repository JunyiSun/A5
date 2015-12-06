'use strict';

var should = require('should'); 
var assert = require('assert');
var mongoose = require('mongoose');
var superagent = require('superagent');
var url = "http://localhost:3000";

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