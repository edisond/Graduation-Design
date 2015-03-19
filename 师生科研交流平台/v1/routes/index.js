var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var session = require('express-session');
var model = require('../model/model');
var Student = model.Student;
var Teacher = model.Teacher;
var Admin = model.Admin;
var md5 = require('../lib/md5');
var db = require('../model/db');
var Dao = db.Dao;

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {
        student: req.session.student,
        teacher: req.session.teacher
    });
})

/* GET open experiment page. */
router.get('/oe', function (req, res) {
    res.render('oe', {
        student: req.session.student,
        teacher: req.session.teacher
    });
})

/* GET challenge cup page. */
router.get('/cc', function (req, res) {
    res.render('cc', {
        student: req.session.student,
        teacher: req.session.teacher
    });
})

/* GET innovation project page. */
router.get('/ip', function (req, res) {
    res.render('ip', {
        student: req.session.student,
        teacher: req.session.teacher
    });
})


/* GET center page. */
router.get('/center', function (req, res) {
    if (req.session.student) {
        res.render('student/center', {
            student: req.session.student
        });
    } else if (req.session.teacher) {
        res.render('teacher/center', {
            teacher: req.session.teacher
        });
    } else {
        res.redirect('/');
    }
})


/* GET student profile page. */
router.get('/profile/:id', function (req, res) {
    if (!req.query.type) {
        res.sendStatus(404);
        return;
    }
    if (!new RegExp("^[0-9]*$").test(req.params.id)) {
        res.sendStatus(404);
        return;
    }
    if (req.query.type === "student") {
        Student.findOne({
            'id': req.params.id
        }, function (err, docs) {
            if (err) {
                res.sendStatus(500);
            } else {
                if (docs) {
                    res.render('student/profile', {
                        student: docs
                    })
                } else {
                    res.sendStatus(404);
                }
            }
        });
    } else if (req.query.type === "teacher") {
        Teacher.findOne({
            'id': req.params.id
        }, function (err, docs) {
            if (err) {
                res.sendStatus(500);
            } else {
                if (docs) {
                    res.render('teacher/profile', {
                        teacher: docs
                    })
                } else {
                    res.sendStatus(404);
                }
            }
        });
    } else {
        res.sendStatus(404);
    }
})

/* GET admin page. */
router.get('/admin', function (req, res) {
    if (req.session.admin) {
        res.render('admin');
    } else {
        //        res.redirect('/');
        req.session.admin = 'admin';
        res.render('admin');
    }
})

module.exports = router;