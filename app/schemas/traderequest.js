var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var TradeRequestSchema = new Schema({
    userId: String,
    textbookId: String,
    offerUserId: {type: String, index: true},
    offerTextbookId: {type: String, index: true},
    status: {type: Number, index: true},             //-1: Rejected, 0: Pending, 1: Complete
    name: String,
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

TradeRequestSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	else{
		this.meta.updateAt = Date.now();
	}
	next();
});

TradeRequestSchema.statics = {
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

module.exports = TradeRequestSchema;
