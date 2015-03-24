var express = require('express');
var router = express.Router();
var db = require('../../model/db');
var Dao = db.Dao;

/* Get student list */
router.get('/student', function (req, res) {
    Dao.getUsers('student', function (err, docs) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.status(200).send(docs);
        }
    })
})

/* Get teacher list */
router.get('/teacher', function (req, res) {
    Dao.getUsers('teacher', function (err, docs) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.status(200).send(docs);
        }
    })
})

/* Get open expertiment list */
router.get('/open-experiment', function (req, res) {
    Dao.getOpenExperiments(function (err, docs) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.status(200).send(docs);
        }
    })
})

module.exports = router;