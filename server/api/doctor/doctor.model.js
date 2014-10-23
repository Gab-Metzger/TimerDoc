'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DoctorSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Doctor', DoctorSchema);