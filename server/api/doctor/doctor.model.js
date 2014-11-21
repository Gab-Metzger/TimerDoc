'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DoctorSchema = new Schema({
    adminID: String,
    lastName: String,
    firstName: String,
    address: String,
    coords: {
        latitude: Number,
        longitude: Number
    },
    phone: String,
    activities: String,
    consultation: String,
    meetings: String,
    nbPatient: Number,
    averageTime: Number,
    state: String,
    url: String,
    infos: String,
    notes: String
});

module.exports = mongoose.model('Doctor', DoctorSchema);