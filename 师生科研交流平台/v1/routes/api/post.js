var express = require('express');
var router = express.Router();
var session = require('express-session');
var db = require('../../model/db');
var fs = require('fs');
var path = require('path');
var Dao = db.Dao;
var md5 = require('../../lib/md5');

/* 更新管理员 */
router.post('/update/admin', function (req, res) {
    if (req.body.op && req.body.np) {
        Dao.checkAdminPassword(req.body.op, function (match) {
            if (match) {
                Dao.updateAdmin(req.body.np, function (err) {
                    res.sendStatus(err ? 500 : 200);
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
    if (req.query.type === 'admin') {
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
                res.sendStatus(err ? 500 : 200);
            })
        } else if (req.query.action === "update") {
            Dao.updateUser(user, function (err) {
                res.sendStatus(err ? 500 : 200);
            });
        } else if (req.query.action === "delete") {
            Dao.deleteUsers(user._id, function (err, doc) {
                res.sendStatus(err ? 500 : 200);
            })
        } else if (req.query.action === "active") {
            Dao.activeUsers(user._id, function (err) {
                res.sendStatus(err ? 500 : 200);
            })
        } else {
            res.sendStatus(404);
        }
    } else if (req.session.user) {
        user._id = req.session.user._id;
        user.id = req.session.user.id;
        if (req.query.action === "pwd") {
            user.password = req.body.op;
            Dao.checkUserPassword(user, function (match) {
                if (match) {
                    user.password = req.body.np;
                    Dao.updateUser(user, function (err) {
                        res.sendStatus(err ? 500 : 200);
                    })
                } else {
                    res.sendStatus(401)
                }
            })
        } else if (req.query.action === "update") {
            if (user.img) {
                var base64Data = user.img.replace(/^data:image\/\w+;base64,/, "");
                var dataBuffer = new Buffer(base64Data, 'base64');
                fs.writeFile("public/img/heads/" + req.session.user._id + ".jpeg", dataBuffer, function (err) {
                    if (err) {
                        res.sendStatus(500);
                    } else {
                        user.img = "/img/heads/" + req.session.user._id + ".jpeg";
                        Dao.updateUser(user, function (err, docs) {
                            res.sendStatus(err ? 500 : 200);
                        })
                    }
                })
            } else {
                Dao.updateUser(user, function (err, docs) {
                    res.sendStatus(err ? 500 : 200);
                })
            }
        } else {
            res.sendStatus(404)
        }
    } else {
        if (req.query.action && req.query.action === 'new') {
            user.active = false;
            Dao.newUser(user, function (err) {
                res.sendStatus(err ? 500 : 200);
            })
        } else {
            res.sendStatus(404)
        }
    }

});

/* 项目 */
router.post('/project', function (req, res) {
    if (req.query.action && req.session.user) {
        if (req.session.user.type === '老师') {
            if (req.query.action === 'new') {
                req.body.creator = req.session.user._id;
                Dao.newProject(req.body, function (err, doc) {
                    res.sendStatus(err ? 500 : 200);
                })
            } else if (req.query.action === 'update') {
                req.body.creator = req.session.user._id;
                Dao.updateProject(req.body, function (err) {
                    res.sendStatus(err ? 500 : 200);
                })
            } else if (req.query.action === 'guide') {
                Dao.getProject(req.body._id, function (err, docs) {
                    if (err || docs.teacher) {
                        res.sendStatus(500)
                    } else {
                        req.body.teacher = req.session.user._id;
                        req.body.active = true;
                        req.body.creator = docs.creator._id;
                        Dao.updateProject(req.body, function (err) {
                            res.sendStatus(err ? 500 : 200);
                        })
                    }
                })
            } else {
                res.sendStatus(404);
            }
        } else if (req.session.user.type === '同学') {
            if (req.query.action === 'new') {
                req.body.active = false;
                req.body.creator = req.session.user._id;
                Dao.newProject(req.body, function (err, doc) {
                    res.sendStatus(err ? 500 : 200);
                })
            } else if (req.query.action === 'update') {
                req.body.creator = req.session.user._id;
                delete req.body.active;
                Dao.updateProject(req.body, function (err) {
                    res.sendStatus(err ? 500 : 200);
                })
            } else {
                res.sendStatus(404);
            }
        } else {
            res.sendStatus(401)
        }
    } else {
        res.sendStatus(404)
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
                res.sendStatus(err ? 500 : 200);
            })
        } else if (action === 'cancel' && req.session.user.type === "同学") {
            var select = {
                student: req.session.user._id,
                project: req.body._id
            };
            Dao.deleteSelect(select, function (err) {
                res.sendStatus(err ? 500 : 200);
            })
        } else if (action === 'approve' && req.session.user.type === "老师") {
            var select = req.body;
            select.active = true;
            Dao.updateSelect(select, function (err) {
                res.sendStatus(err ? 500 : 200);
            })
        } else {
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(401);
    }
});

router.post('/team', function (req, res) {
    if (req.session.user) {
        var action = req.query.action;
        if (action === 'new' && req.session.user.type === "同学") {
            var team = {
                name: req.body.name,
                leader: req.session.user._id,
                desc: req.body.desc
            }
            Dao.getTeams({
                leader: team.leader
            }, function (err, docs) {
                if (err) {
                    res.sendStatus(500)
                } else {
                    if (docs.length < 5) {
                        Dao.newTeam(team, function (err, docs) {
                            if (err) {
                                res.sendStatus(500)
                            } else {
                                Dao.newTeamApply({
                                    user: docs.leader,
                                    active: true,
                                    team: docs._id
                                }, function (err) {
                                    if (err) {
                                        res.sendStatus(500)
                                    } else {
                                        res.status(200).send(docs._id);
                                    }
                                })

                            }
                        })
                    } else {
                        res.sendStatus(403);
                    }
                }
            })

        } else {
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(401);
    }
})

router.post('/teamapply', function (req, res) {
    if (req.session.user) {
        var action = req.query.action;
        if (action === 'apply') {
            var teamapply = {
                user: req.session.user._id,
                team: req.body._id
            };
            Dao.newTeamApply(teamapply, function (err) {
                res.sendStatus(err ? 500 : 200);
            })
        } else if (action === 'cancel') {
            var teamapply = {
                user: req.session.user._id,
                team: req.body._id
            };
            Dao.deleteTeamApply(teamapply, function (err) {
                res.sendStatus(err ? 500 : 200);
            })
        } else if (action === 'approve') {
            var teamapply = req.body;
            Dao.getTeam(teamapply.team, function (err, doc) {
                if (err) {
                    res.sendStatus(500)
                } else {
                    try {
                        if (doc.leader._id.toString() === req.session.user._id.toString()) {
                            teamapply.active = true;
                            Dao.updateTeamApply(teamapply, function (err) {
                                res.sendStatus(err ? 500 : 200);
                            })
                        } else {
                            res.sendStatus(401)
                        }
                    } catch (err) {
                        res.sendStatus(500);
                    }
                }
            })
        } else {
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(401);
    }
});

module.exports = router;