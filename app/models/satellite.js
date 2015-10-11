// app/models/satellite.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SatelliteSchema   = new Schema({
    satelliteName: String,
	currentPass: Number,
});

module.exports = mongoose.model('Satellite', SatelliteSchema);