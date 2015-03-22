var express = require('express');
var router = express.Router();
var session = require('express-session');
var db = require('../model/db');
var Dao = db.Dao;

/* 主页 */
router.get('/', function (req, res) {
    res.render('index', {
        student: req.session.student,
        teacher: req.session.teacher
    });
})

/* 开放实验列表页 */
router.get('/open-experiment', function (req, res) {
    res.render('openExperiment', {
        student: req.session.student,
        teacher: req.session.teacher
    });
})

/* 开放实验新建页 */
router.get('/open-experiment/new', function (req, res) {
    if (req.session.teacher) {
        res.render('openExperimentNew', {
            teacher: req.session.teacher
        });
    } else {
        res.redirect('/');
    }
})

/* 挑战杯列表页 */
router.get('/cc', function (req, res) {
    res.render('cc', {
        student: req.session.student,
        teacher: req.session.teacher
    });
})

/* 挑战杯新建页 */
router.get('/cc/new', function (req, res) {
    if (req.session.teacher) {
        res.render('cc/new', {
            teacher: req.session.teacher
        });
    } else {
        res.redirect('cc');
    }
})

/* 创新项目列表页 */
router.get('/ip', function (req, res) {
    res.render('ip', {
        student: req.session.student,
        teacher: req.session.teacher
    });
})


/* 个人中心页 */
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


/* 学生个人资料页 */
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

/* 管理员页 */
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