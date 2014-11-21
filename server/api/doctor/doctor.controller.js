/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /doctors              ->  index
 * POST    /doctors              ->  create
 * GET     /doctors/:id          ->  show
 * PUT     /doctors/:id          ->  update
 * DELETE  /doctors/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Doctor = require('./doctor.model.js');

// Get list of doctors
exports.index = function(req, res) {
  Doctor.find(function (err, doctors) {
    if(err) { return handleError(res, err); }
    return res.json(200, doctors);
  });
};

// Get a single doctor
exports.show = function(req, res) {
  Doctor.findById(req.params.id, function (err, doctor) {
    if(err) { return handleError(res, err); }
    if(!doctor) { return res.send(404); }
    return res.json(doctor);
  });
};

// Get all doctor matches with adminID
exports.admin = function(req, res) {
    Doctor.find({adminID: req.params.adminid}, function (err, doctors) {
        if(err) { return handleError(res, err); }
        if(!doctors) { return res.send(404); }
        return res.json(doctors);
    });
};

// Creates a new doctor in the DB.
exports.create = function(req, res) {
    Doctor.create(req.body, function(err, doctor) {
        if(err) { return handleError(res, err); }
        return res.json(201, doctor);
    });
};

// Updates an existing doctor in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Doctor.findById(req.params.id, function (err, doctor) {
    if (err) { return handleError(res, err); }
    if(!doctor) { return res.send(404); }
    var updated = _.merge(doctor, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, doctor);
    });
  });
};

// Deletes a doctor from the DB.
exports.destroy = function(req, res) {
  Doctor.findById(req.params.id, function (err, doctor) {
    if(err) { return handleError(res, err); }
    if(!doctor) { return res.send(404); }
    doctor.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}