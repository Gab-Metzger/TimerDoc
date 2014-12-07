'use strict';

var express = require('express');
var controller = require('./doctor.controller.js');
var auth = require('../../auth/auth.service');


var router = express.Router();

router.get('/', controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/admin/:adminid', auth.hasRole('admin'), controller.admin);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;