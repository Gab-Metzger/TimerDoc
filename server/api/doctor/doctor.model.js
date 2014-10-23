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
  email: String,
  phone: String,
  consultation: String,
  nbPatient: Number,
  averageTime: Number,
  appointment: Boolean
});

module.exports = mongoose.model('Doctor', DoctorSchema);