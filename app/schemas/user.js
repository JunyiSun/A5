var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
	email:{
		unique:true,
		type:String,
		index: true,
	},
	password:String,
	google:{
		id: String,
		token: String,
		email: String,
		name: String
	},
	name: String,
	description: String,
	image: String,
	devices: String,
	ip: String,
	geo: Object,
	messages: [{type: ObjectId, ref: 'Message'}],
	/*
	0:nomal user
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
		this.name = this.email;
		this.image = "gravatar.png";
	}
	else{
		this.meta.updateAt = Date.now();
	}
	next();
});


UserSchema.methods = {
	generateHash: function(password){
		return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
	},
	comparePassword : function(password){
		return bcrypt.compareSync(password, this.password)
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
