var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var session = require('express-session');
var model = require('../../model/model');
var Student = model.Student;
var Teacher = model.Teacher;
var Admin = model.Admin;
var db = require('../../model/db');
var Dao = db.Dao;


/* 更新管理员 */
router.post('/update/admin', function (req, res) {
    if (req.body.op && req.body.np) {
        Dao.checkAdminPassword(req.body.op, function (match) {
            if (match) {
                Dao.updateAdmin(req.body.np, function (err) {
                    if (err) {
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(200);
                    }
                })
            } else {
                res.sendStatus(401);
            }
        })
    } else {
        res.sendStatus(404);
    }
});

/* 登录 */
router.post('/signin', function (req, res) {
    if (req.query.type && req.body.pwd) {
        if (req.query.type === 'student') {
            var student = {
                'id': req.body.id,
                'password': req.body.pwd
            };
            Dao.checkStudentPassword(student, function (match, docs) {
                if (match) {
                    req.session.student = docs;
                    res.sendStatus(200);
                } else {
                    res.sendStatus(401);
                }
            })
        } else if (req.query.type === 'teacher') {
            var teacher = {
                'id': req.body.id,
                'password': req.body.pwd
            };
            Dao.checkTeacherPassword(teacher, function (match, docs) {
                if (match) {
                    req.session.teacher = docs;
                    res.sendStatus(200);
                } else {
                    res.sendStatus(401);
                }
            })
        } else if (req.query.type === 'admin') {
            Dao.checkAdminPassword(req.body.pwd, function (match) {
                if (match) {
                    req.session.admin = 'admin';
                    res.sendStatus(200);
                } else {
                    res.sendStatus(401);
                }
            })
        }
    } else {
        res.sendStatus(404);
    }
})

/* 注销 */
router.post('/signout', function (req, res) {
    req.session.destroy();
    res.sendStatus(200);
})

/* 添加新教师 */
router.post('/new/teacher', function (req, res) {
    var teacher = {
        id: req.body.id,
        password: req.body.password,
        name: req.body.name,
        sex: req.body.sex,
        department: req.body.department,
        title: req.body.title,
        email: req.body.email,
        phone: req.body.phone,
        active: req.body.active
    };
    Dao.newTeacher(teacher, function (err) {
        if (err) {
            res.sendStatus(500)
        } else {
            res.sendStatus(200);
        }
    })
});

/* 添加新学生 */
router.post('/new/student', function (req, res) {
    var student = {
        id: req.body.id,
        password: req.body.password,
        name: req.body.name,
        sex: req.body.sex,
        college: req.body.college,
        major: req.body.major,
        grade: req.body.grade,
        type: req.body.type,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        active: req.body.active
    };
    Dao.newStudent(student, function (err) {
        if (err) {
            res.sendStatus(500)
        } else {
            res.sendStatus(200);
        }
    })
});

/* 更新一个教师 */
router.post('/update/teacher', function (req, res) {
    if (req.session.admin) {
        var teacher = {
            id: req.body.id,
            password: req.body.password,
            name: req.body.name,
            sex: req.body.sex,
            department: req.body.department,
            title: req.body.title,
            email: req.body.email,
            phone: req.body.phone,
            active: req.body.active
        };
        Dao.updateTeacher(teacher, function (err) {
            if (err) {
                res.sendStatus(500);
            } else {
                if (teacher.password) {
                    Dao.updateTeacherPassword(teacher, function (err) {
                        if (err) {
                            res.sendStatus(500);
                        } else {
                            res.sendStatus(200);
                        }
                    })
                } else {
                    res.sendStatus(200);
                }
            }
        });

    } else {
        res.sendStatus(401);
    }
});

/* 更新一个学生 */
router.post('/update/student', function (req, res) {
    if (req.session.admin) {
        var student = {
            id: req.body.id,
            password: req.body.password,
            name: req.body.name,
            sex: req.body.sex,
            college: req.body.college,
            major: req.body.major,
            type: req.body.type,
            grade: req.body.grade,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            active: req.body.active
        };
        Dao.updateStudent(student, function (err) {
            if (err) {
                res.sendStatus(500);
            } else {
                if (student.password) {
                    Dao.updateStudentPassword(student, function (err) {
                        if (err) {
                            res.sendStatus(500);
                        } else {
                            res.sendStatus(200);
                        }
                    })
                } else {
                    res.sendStatus(200);
                }
            }
        });

    } else {
        res.sendStatus(401);
    }
});

/* 删除教师 */
router.post('/delete/teacher', function (req, res) {
    if (req.session.admin) {
        var id = req.body['id[]'];
        if (typeof id === 'string') {
            id = [id];
        }
        var reg = new RegExp("^[0-9]*$");
        for (var i = 0, j = id.length; i < j; i++) {
            if (!reg.test(id[i])) {
                res.sendStatus(404);
                return false;
            }
        }
        Dao.deleteTeachers(id, function (err) {
            if (err) {
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        })
    } else {
        res.sendStatus(401);
    }
})

/* 删除学生 */
router.post('/delete/student', function (req, res) {
    if (req.session.admin) {
        var id = req.body['id[]'];
        if (typeof id === 'string') {
            id = [id];
        }
        var reg = new RegExp("^[0-9]*$");
        for (var i = 0, j = id.length; i < j; i++) {
            if (!reg.test(id[i])) {
                res.sendStatus(404);
                return false;
            }
        }
        Dao.deleteStudents(id, function (err) {
            if (err) {
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        })
    } else {
        res.sendStatus(401);
    }
})

module.exports = router;