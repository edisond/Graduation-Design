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
    if (req.query.type && req.query.type === 'admin') {
        Dao.checkAdminPassword(req.body.password, function (match) {
            if (match) {
                req.session.admin = 'admin';
                res.sendStatus(200);
            } else {
                res.sendStatus(401);
            }
        })

    } else {
        var user = req.body;
        Dao.checkUserPassword(user, function (match, docs) {
            if (match) {
                req.session.user = docs;
                res.sendStatus(200);
            } else {
                res.sendStatus(401);
            }
        })
    }
})

/* 注销 */
router.post('/signout', function (req, res) {
    req.session.destroy();
    res.sendStatus(200);
})

/* 用户 */
router.post('/user', function (req, res) {
    var user = req.body;
    if (req.session.admin) {
        if (req.query.action === "new") {
            Dao.newUser(user, function (err) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500)
                } else {
                    res.sendStatus(200);
                }
            })
        } else if (req.query.action === "update") {
            Dao.updateUser(user, function (err) {
                res.sendStatus(err ? 500 : 200);
            });
        } else if (req.query.action === "delete") {
            Dao.deleteUsers(user._id, function (err, doc) {
                console.log(doc);
                if (err) {
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            })
        } else if (req.query.action === "active") {
            Dao.activeUsers(user._id, function (err) {
                if (err) {
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            })
        } else {
            res.sendStatus(404);
        }
    } else if (req.session.user) {
        if (req.query.action === "pwd") {
            var user = {
                id: req.session.user.id,
                password: req.body.op
            };
            Dao.checkUserPassword(user, function (match) {
                if (match) {
                    user.password = req.body.np;
                    Dao.updateUser(user, function (err) {
                        if (err) {
                            res.sendStatus(500)
                        } else {
                            res.sendStatus(200)
                        }
                    })
                } else {
                    res.sendStatus(401)
                }
            })
        } else if (req.query.action === "update") {
            var user = req.body;
            user._id = req.session.user._id;
            Dao.updateUser(user, function (err, docs) {
                if (err) {
                    res.sendStatus(500)
                } else {
                    res.sendStatus(200);
                }
            })
        } else {
            res.sendStatus(404)
        }
    } else {
        if (req.query.action && req.query.action === 'new') {
            user.active = false;
            Dao.newUser(user, function (err) {
                if (err) {
                    res.sendStatus(500)
                } else {
                    res.sendStatus(200)
                }
            })
        } else {
            res.sendStatus(404)
        }
    }

});

/* 项目 */
router.post('/project', function (req, res) {
    if (req.query.action && req.session.user._id === req.body.teacher) {
        if (req.query.action === 'new') {
            Dao.newProject(req.body, function (err, doc) {
                if (err) {
                    res.sendStatus(500)
                } else {
                    res.status(200).send(doc._id)
                }
            })
        } else {
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(401)
    }
});

/* 讨论 */
router.post('/comment', function (req, res) {
    if (req.session.user._id === req.body.from) {
        if (req.query.action === "new") {
            Dao.newComment(req.body, function (err) {
                res.sendStatus(err ? 500 : 200)
            })
        } else {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(401);
    }
});

router.post('/select', function (req, res) {

    if (req.session.user) {
        var action = req.query.action;

        if (action === 'apply' && req.session.user.type === "同学") {
            var select = {
                student: req.session.user._id,
                project: req.body._id
            };
            Dao.newSelect(select, function (err) {
                if (err) {
                    res.sendStatus(500)
                } else {
                    res.sendStatus(200);
                }
            })
        } else if (action === 'cancel' && req.session.user.type === "同学") {
            var select = {
                student: req.session.user._id,
                project: req.body._id
            };
            Dao.deleteSelect(select, function (err) {
                if (err) {
                    res.sendStatus(500)
                } else {
                    res.sendStatus(200);
                }
            })
        } else if (action === 'approve' && req.session.user.type === "老师") {
            var select = req.body;
            select.active = true;
            console.log(select);
            Dao.updateSelect(select, function (err) {
                if (err) {
                    console.log(err)
                    res.sendStatus(500)
                } else {
                    res.sendStatus(200);
                }
            })
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
});

module.exports = router;