var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


var UserSchema = new Schema({
	email:{
		unique:true,
		type:String
	},
	password:String,
	newpassword: String,
	name: String,
	description: String,
	image: String,
	devices: String,
	ip: String,
	geo: Object,
	/*
	0:nomal user
	1:verified user
	2:prefessional user
	>10: admin
	=20:super admin
	 */
	role:{
		type:Number,
		default:0
	},
	pv:{
		type:Number,
		default:0
	},
  meta: {
  	createAt: {
    	type: Date,
    	default: Date.now()
  },
  updateAt: {
    type: Date,
    default: Date.now()
  }
 }
});

//if create a new account, set its default value
UserSchema.pre('save',function(next){
	var user = this;
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();

		bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
			if(err) return next(err);

			bcrypt.hash(this.password,salt,function(err,hash){
				if(err) return next(err);
				this.password = hash;
			});
		});
		this.name = this.email;
		this.image = "gravatar.jpeg";
	}
	else{
		this.meta.updateAt = Date.now();
	}
	next();
});


UserSchema.methods = {
	// hashPassword: function(password){
	// 	bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
	// 		bcrypt.hash(this.password,salt,function(err,hash){
	// 			//if(err) return next(err);
	// 			this.password = hash;
	// 			//next();
	// 		});
	// 	});
	// },
	comparePassword : function(password,cb){

		// bcrypt.compare(password,this.password,function(err,isMatch){
		// 	if(err) return cb(err);
		//
		// 	cb(null,isMatch);
		// });
		if(password == this.password){
			cb(null,true)
		}
		else{
			cb(null,false)
		}
	}
};


UserSchema.statics = {
	fetch : function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb);
	},
	findById : function(id,cb){
		return this
			.findOne({_id:id})
			.exec(cb);
	}
};

module.exports = UserSchema;
