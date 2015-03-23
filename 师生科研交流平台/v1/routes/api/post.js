var express = require('express');
var router = express.Router();
var session = require('express-session');
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
    var teacher = req.body;
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
    var student = req.body;
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
        var teacher = req.body;
        Dao.updateTeacher(teacher, function (err) {
            res.sendStatus(err ? 500 : 200);
        });

    } else {
        res.sendStatus(401);
    }
});

/* 更新一个学生 */
router.post('/update/student', function (req, res) {
    if (req.session.admin) {
        var student = req.body;
        Dao.updateStudent(student, function (err) {
            res.sendStatus(err ? 500 : 200);
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

/* 添加新开放实验 */
router.post('/new/open-experiment', function (req, res) {
    if (req.session.teacher['_id'] === req.body.teacher) {
        Dao.newOpenExperiment(req.body, function (err) {
            res.sendStatus(err ? 500 : 200)
        })
    } else {
        res.sendStatus(401);
    }
});
module.exports = router;