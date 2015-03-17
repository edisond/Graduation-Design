var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var session = require('express-session');
var model = require('../model/model');
var Student = model.Student;
var Teacher = model.Teacher;
var Admin = model.Admin;

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


/* GET student center page. */
router.get('/student/center', function (req, res) {
    if (req.session.student) {
        res.render('student-center', {
            student: req.session.student
        });
    } else {
        res.redirect('/');
    }
})

/* GET teacher center page. */
router.get('/teacher/center', function (req, res) {
    if (req.session.teacher) {
        res.render('teacher-center', {
            teacher: req.session.teacher
        });
    } else {
        res.redirect('/');
    }
})

/* GET student profile page. */
router.get('/student/profile/:id', function (req, res) {
    var reg = new RegExp("^[0-9]*$");
    if (!reg.test(req.params.id)) {
        res.sendStatus(404);
        return;
    } else {
        Student.findOne({
            'id': req.params.id
        }, function (err, docs) {
            if (err) {
                res.sendStatus(500);
            } else {
                if (docs) {
                    res.render('student-profile', {
                        student: docs
                    })
                } else {
                    res.sendStatus(404);
                }
            }
        });
    }

})

/* GET teacher profile page. */
router.get('/teacher/profile/:id', function (req, res) {
    var reg = new RegExp("^[0-9]*$");
    if (!reg.test(req.params.id)) {
        res.sendStatus(404);
        return;
    } else {
        Teacher.findOne({
            'id': req.params.id
        }, function (err, docs) {
            if (err) {
                res.sendStatus(500);
            } else {
                if (docs) {
                    res.render('teacher-profile', {
                        teacher: docs
                    })
                } else {
                    res.sendStatus(404);
                }
            }
        });
    }
})

/* GET admin page. */
router.get('/admin', function (req, res) {
    //    if (req.session.admin) {
    //        res.render('admin');
    //    } else {
    //        res.redirect('/');
    //    }

    // debug
    req.session.admin = 'admin';
    res.render('admin');
})

module.exports = router;