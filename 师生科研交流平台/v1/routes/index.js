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


/* GET center page. */
router.get('/student/center', function (req, res) {
    if (req.session.student) {
        res.render('student-center', {
            student: req.session.student
        });
    } else {
        res.redirect('/');
    }
})

/* GET profile page. */
router.get('/student/profile/:id', function (req, res) {
    var reg = new RegExp("^[0-9]*$");
    if (!reg.test(req.params.id)) {
        res.send('bad request');
        return;
    }
    Student.findOne({
        'id': req.params.id
    }, function (err, docs) {
        if (docs) {
            res.render('student-profile', {
                student: docs
            })
        } else res.sendStatus(500);
    });
})

/* GET admin page. */
router.get('/admin', function (req, res) {
    if (req.session.admin) {
        res.render('admin');
    } else {
        res.redirect('/');
    }
})

/* ajax */
router.get('/api/get/student', function (req, res) {
    Student.find({}, '-_id id name major grade type active', function (err, docs) {
        res.send(docs)
    })
})

router.get('/api/get/teacher', function (req, res) {
    Teacher.find({}, '-_id id name department title', function (err, docs) {
        res.send(docs)
    })
})

router.post('/api/post/signin', function (req, res) {
    if (req.query.type && req.query.type === 'admin') {
        Admin.findOne({
            'password': req.body.pwd
        }, function (err, docs) {
            if (docs) {
                req.session.admin = docs;
                res.sendStatus(200);
            } else res.sendStatus(401);
        })
    } else {
        Student.findOne({
            'id': req.body.id,
            'password': req.body.pwd
        }, function (err, docs) {
            if (docs) {
                req.session.student = docs;
                res.sendStatus(200);
            } else res.sendStatus(401);
        })
    }
})

router.post('/api/post/signout', function (req, res) {
    req.session.destroy();
    res.sendStatus(200);
})

router.post('/api/post/new/teacher', function (req, res) {
    if (req.session.admin) {
        Teacher.findOne({
            'id': req.body.id
        }, function (err, docs) {
            if (docs) {
                //409 Conflict
                res.sendStatus(409);
            } else {
                var teacher = new Teacher();
                teacher.id = req.body.id;
                teacher.name = req.body.name;
                teacher.password = req.body.pwd;
                teacher.department = req.body.department;
                teacher.title = req.body.title;
                teacher.email = '';
                teacher.save(function (err, product, numberAffected) {
                    if (err) {
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(200);
                    }
                })
            }
        })
    } else {
        res.sendStatus(401);
    }

});

router.post('/api/post/delete/teacher', function (req, res) {
    if (req.session.admin) {
        var id = req.body['id[]'];
        if (typeof id === 'string') {
            id = [id];
        }
        Teacher.remove({
            'id': {
                $in: id
            }
        }, function (err, docs) {
            if (err)
                res.sendStatus(500);
            res.sendStatus(200);
        });
    } else {
        res.sendStatus(401);
    }
})

router.post('/api/post/new/student', function (req, res) {
    if (req.session.admin) {
        Student.findOne({
            'id': req.body.id
        }, function (err, docs) {
            if (docs) {
                //409 Conflict
                res.sendStatus(409);
            } else {
                var student = new Student();
                student.id = req.body.id;
                student.name = req.body.name;
                student.password = req.body.pwd;
                student.major = req.body.major;
                student.grade = req.body.grade;
                student.type = req.body.type;
                student.active = req.body.active;
                student.email = '';
                student.save(function (err, product, numberAffected) {
                    if (err) {
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(200);
                    }
                })
            }
        })
    } else {
        res.sendStatus(401);
    }

});

router.post('/api/post/delete/student', function (req, res) {
    if (req.session.admin) {
        var id = req.body['id[]'];
        if (typeof id === 'string') {
            id = [id];
        }
        Student.remove({
            'id': {
                $in: id
            }
        }, function (err, docs) {
            if (err)
                res.sendStatus(500);
            res.sendStatus(200);
        });
    } else {
        res.sendStatus(401);
    }
})

module.exports = router;