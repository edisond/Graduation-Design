var express = require('express');
var router = express.Router();
var db = require('../../model/db');
var Dao = db.Dao;

/* Get user list */
router.get('/user', function (req, res) {
    var condition = {};
    if (req.query.type) condition.type = req.query.type;
    Dao.getUsers(condition, function (err, docs) {
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
        var condition = {};
        if (req.query.project) condition.project = req.query.project;
        if (req.query.to) condition.to = req.query.to;
        Dao.getComments(condition, function (err, docs) {
            if (err) {
                res.sendStatus(500)
            } else {
                res.status(200).send(docs);
            }
        })
    } else {
        res.sendStatus(401);
    }

})

/* Get project */
router.get('/project', function (req, res) {
    var condition = {};
    if (req.query.type) condition.type = req.query.type;
    Dao.getProjects(condition, function (err, docs) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.status(200).send(docs);
        }
    })
})

module.exports = router;