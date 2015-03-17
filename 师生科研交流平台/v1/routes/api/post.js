var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var session = require('express-session');
var model = require('../../model/model');
var Student = model.Student;
var Teacher = model.Teacher;
var Admin = model.Admin;

/* Do sign in */
router.post('/signin', function (req, res) {
    if (req.query.type) {
        if (req.query.type === 'student') {
            Student.findOne({
                'id': req.body.id,
                'password': req.body.pwd
            }, function (err, docs) {
                if (err) {
                    res.sendStatus(500);
                } else {
                    if (docs) {
                        req.session.student = docs;
                        res.sendStatus(200);
                    } else {
                        res.sendStatus(401);
                    }
                }
            })
        } else if (req.query.type === 'teacher') {
            Teacher.findOne({
                'id': req.body.id,
                'password': req.body.pwd
            }, function (err, docs) {
                if (err) {
                    res.sendStatus(500);
                } else {
                    if (docs) {
                        req.session.teacher = docs;
                        res.sendStatus(200);
                    } else {
                        res.sendStatus(401);
                    }
                }
            })
        } else if (req.query.type === 'admin') {
            Admin.findOne({
                'password': req.body.pwd
            }, function (err, docs) {
                if (err) {
                    res.sendStatus(500);
                } else {
                    if (docs) {
                        req.session.admin = docs;
                        res.sendStatus(200);
                    } else {
                        res.sendStatus(401);
                    }
                }
            })
        }
    } else {
        res.sendStatus(404);
    }
})

/* Do sign out */
router.post('/signout', function (req, res) {
    if (req.session.student || req.session.teacher || req.session.admin) {
        req.session.destroy();
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
})

/* Add new teacher */
router.post('/new/teacher', function (req, res) {
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

/* Add new student */
router.post('/new/student', function (req, res) {
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

/* Update teacher */
router.post('/update/teacher', function (req, res) {
    if (req.session.admin) {
        var update = {
            name: req.body.name,
            department: req.body.department,
            title: req.body.title
        };
        if (req.query.changePwd && req.query.changePwd === 'true') {
            update.password = req.body.pwd;
        }
        Teacher.findOneAndUpdate({
            id: req.body.id
        }, update, function (err, docs) {
            if (err) {
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        })
    } else {
        res.sendStatus(401);
    }
});

/* Update student */
router.post('/update/student', function (req, res) {
    if (req.session.admin) {
        var update = {
            name: req.body.name,
            major: req.body.major,
            type: req.body.type,
            grade: req.body.grade,
            active: req.body.active
        };
        if (req.query.changePwd && req.query.changePwd === 'true') {
            update.password = req.body.pwd;
        }
        Student.findOneAndUpdate({
            id: req.body.id
        }, update, function (err, docs) {
            if (err) {
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        })
    } else {
        res.sendStatus(401);
    }
});

/* Delete teacher */
router.post('/delete/teacher', function (req, res) {
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
            if (err) {
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        });
    } else {
        res.sendStatus(401);
    }
})

/* Delete student */
router.post('/delete/student', function (req, res) {
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
            if (err) {
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        });
    } else {
        res.sendStatus(401);
    }
})

module.exports = router;