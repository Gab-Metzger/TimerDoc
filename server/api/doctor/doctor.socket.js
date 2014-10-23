/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var doctor = require('./doctor.model.js');

exports.register = function(socket) {
  doctor.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  doctor.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('doctor:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('doctor:remove', doc);
}