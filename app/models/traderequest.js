var mongoose = require('mongoose');
var TradeRequestSchema = require('../schemas/traderequest');

var TradeRequest = mongoose.model('TradeRequest',TradeRequestSchema);

module.exports = TradeRequest;
