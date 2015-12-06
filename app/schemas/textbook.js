var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var TextbookSchema = new Schema({
	title: String,
    author: String,
    edition: String,
	course: String,
    language: String,
	summary: String,
	photo: String,
	userId: String,         //user who creates this textbook
	price: String,
	subject:{
		type:ObjectId,
		ref:'Subject',
		index: true
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
    },
    rating:{
        type:Number,
        default:100
    }
});

TextbookSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
		if(this.photo === undefined){
			this.photo = "textbook.jpg";
		}
	}
	else{
		this.meta.updateAt = Date.now();
	}
	next();
});


TextbookSchema.statics = {
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

module.exports = TextbookSchema;
