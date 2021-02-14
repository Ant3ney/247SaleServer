//User model
var mongoose = require("mongoose");

var specialDealsSchema = new mongoose.Schema({
	featured: mongoose.Schema.Types.Mixed,
	popular: [{
        type: mongoose.Schema.Types.Mixed
    }]
});

module.exports = mongoose.model("SpecialDeals", specialDealsSchema);