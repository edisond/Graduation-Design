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

/* Get comment */
router.get('/comment', function (req, res) {
    if (req.session.user) {
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }

})

/* Get project */
router.get('/project', function (req, res) {
    if (req.session.user) {
        console.log(req.query);
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }

})

module.exports = router;