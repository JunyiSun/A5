var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var TextbookSchema = new Schema({
	title: String,
    author: String,
    edition: String,
	location: String,
    language: String,
	summary: String,
	photo: String,
    userId: String,
	subject:{
		type:ObjectId,
		ref:'Subject'
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

//模式保存前执行下面函数,如果当前数据是新创建，则创建时间和更新时间都是当前时间，否则更新时间是当前时间
TextbookSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
		this.photo = "textbook.jpg";
	}
	else{
		this.meta.updateAt = Date.now();
	}
	next();
});

//静态方法不会与数据库直接交互，需要经过模型编译实例化后才会具有该方法
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
