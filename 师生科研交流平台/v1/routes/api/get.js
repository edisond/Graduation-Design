var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var model = require('../../model/model');
var Student = model.Student;
var Teacher = model.Teacher;

/* Get student list */
router.get('/student', function (req, res) {
    Student.find({}, '-_id id name major grade type active', function (err, docs) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.status(200).send(docs);
        }
    })
})

/* Get teacher list */
router.get('/teacher', function (req, res) {
    Teacher.find({}, '-_id id name department title', function (err, docs) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.status(200).send(docs);
        }
    })
})

module.exports = router;