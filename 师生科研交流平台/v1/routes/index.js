var express = require('express');
var router = express.Router();
var session = require('express-session');
var moment = require('moment');
var db = require('../model/db');
var Dao = db.Dao;

/* 主页 */
router.get('/', function (req, res) {
    Dao.countUser({
        type: '老师'
    }, function (utcount) {
        Dao.countUser({
            type: '同学'
        }, function (uscount) {
            Dao.countProject({}, function (pcount) {
                Dao.countTeam({}, function (tcount) {
                    res.render('index', {
                        user: req.session.user,
                        utcount: utcount,
                        uscount: uscount,
                        pcount: pcount,
                        tcount: tcount
                    });
                })
            })
        })
    })
})

/* 注册页 */
router.get('/register', function (req, res) {
    res.render('register', {
        user: req.session.user
    });
})

/* 登录页 */
router.get('/login', function (req, res) {
    res.render('login', {
        user: req.session.user
    });
})

/* 搜索页 */
router.get('/search', function (req, res) {
    res.render('search', {
        user: req.session.user
    });
})

/* 开放实验列表页 */
router.get('/open-experiment', function (req, res) {
    res.render('project', {
        user: req.session.user,
        projectType: '开放实验项目'
    });
})

/* 挑战杯列表页 */
router.get('/challenge-cup', function (req, res) {
    res.render('project', {
        user: req.session.user,
        projectType: '挑战杯项目'
    });
})

/* 创新项目列表页 */
router.get('/innovation-project', function (req, res) {
    res.render('project', {
        user: req.session.user,
        projectType: '科技创新工程项目'
    });
})

/* 项目具体页 */
router.get('/project/:id', function (req, res) {
    if (req.session.user) {
        Dao.getProject(req.params.id, function (err, docs) {
            if (docs) {
                docs.dateUpdate = moment(docs.dateUpdate).fromNow();
                docs.dateStart = moment(docs.dateStart).format('l');
                docs.dateEnd = moment(docs.dateEnd).format('l');
                if (docs.type === '开放实验项目') {
                    var isSelected = false,
                        isApplied = false,
                        condition = {
                            student: req.session.user._id,
                            project: docs._id
                        };
                    Dao.getSelects(condition, function (err, doc) {
                        if (err) {
                            res.sendStatus(500);
                        } else {
                            if (doc.length === 1 && doc[0].active) {
                                isSelected = true
                            } else if (doc.length === 1 && doc[0].active === false) {
                                isApplied = true
                            }
                            res.render('projectView', {
                                project: docs,
                                user: req.session.user,
                                isSelected: isSelected,
                                isApplied: isApplied
                            })
                        }
                    })
                } else if (docs.type === '挑战杯项目') {
                    var condition = {
                        project: docs._id,
                        active: true
                    };
                    Dao.getSelects(condition, function (err, doc) {
                        if (err) {
                            res.sendStatus(500);
                        } else {
                            res.render('projectView', {
                                project: docs,
                                user: req.session.user,
                                team: (doc.length && doc[0].team) ? doc[0].team : undefined
                            })
                        }
                    })
                } else if (docs.type === '科技创新工程项目') {
                    var condition = {
                        project: docs._id,
                        active: true
                    };
                    Dao.getSelects(condition, function (err, doc) {
                        if (err) {
                            res.sendStatus(500);
                        } else {
                            res.render('projectView', {
                                project: docs,
                                user: req.session.user,
                                team: (doc.length && doc[0].team) ? doc[0].team : undefined
                            })
                        }
                    })
                }

            } else {
                res.sendStatus(404);
            }
        })
    } else {
        Dao.getProject(req.params.id, function (err, docs) {
            if (docs) {
                docs.dateUpdate = moment(docs.dateUpdate).fromNow();
                docs.dateStart = moment(docs.dateStart).format('l');
                docs.dateEnd = moment(docs.dateEnd).format('l');
                if (docs.type === '开放实验项目') {
                    res.render('projectView', {
                        project: docs
                    })
                } else if (docs.type === '挑战杯项目') {
                    var condition = {
                        project: docs._id,
                        active: true
                    };
                    Dao.getSelects(condition, function (err, doc) {
                        if (err) {
                            res.sendStatus(500);
                        } else {
                            res.render('projectView', {
                                project: docs,
                                team: (doc.length && doc[0].team) ? doc[0].team : undefined
                            })
                        }
                    })
                } else if (docs.type === '科技创新工程项目') {
                    var condition = {
                        project: docs._id,
                        active: true
                    };
                    Dao.getSelects(condition, function (err, doc) {
                        if (err) {
                            res.sendStatus(500);
                        } else {
                            res.render('projectView', {
                                project: docs,
                                team: (doc.length && doc[0].team) ? doc[0].team : undefined
                            })
                        }
                    })
                }

            } else {
                res.sendStatus(404);
            }
        })
    }
})


/* 个人中心页 */
router.get('/center', function (req, res) {
    if (req.session.user) {
        res.render('center', {
            user: req.session.user
        });
    } else {
        res.redirect('/');
    }
})

router.get('/profile/:id', function (req, res) {
    if (req.session.user) {
        if (req.session.user._id.toString() === req.params.id.toString()) {
            res.redirect('/center');
        } else {
            Dao.getUser(req.params.id, function (err, docs) {
                if (err) {
                    res.sendStatus(500)
                } else {
                    res.render('profile', {
                        user: req.session.user,
                        profile: docs
                    });
                }
            })
        }
    } else {
        Dao.getUser(req.params.id, function (err, docs) {
            if (err) {
                res.sendStatus(500)
            } else {
                res.render('profile', {
                    profile: docs
                });
            }
        })
    }
})

router.get('/team/:id', function (req, res) {
    if (req.session.user) {
        Dao.getTeam(req.params.id, function (err, docs) {
            if (docs) {
                docs.dateCreate = moment(docs.dateCreate).fromNow();

                var isSelected = false,
                    isApplied = false,
                    condition = {
                        user: req.session.user._id,
                        team: docs._id
                    };
                Dao.getTeamApplies(condition, function (err, doc) {
                    if (err) {
                        res.sendStatus(500);
                    } else {
                        if (doc.length === 1 && doc[0].active) {
                            isSelected = true
                        } else if (doc.length === 1 && doc[0].active === false) {
                            isApplied = true
                        }
                        res.render('team', {
                            team: docs,
                            user: req.session.user,
                            isSelected: isSelected,
                            isApplied: isApplied
                        })
                    }
                })
            } else {
                res.sendStatus(404);
            }
        })

    } else {
        Dao.getTeam(req.params.id, function (err, docs) {
            if (docs) {
                docs.dateCreate = moment(docs.dateCreate).fromNow();
                res.render('team', {
                    team: docs
                })
            } else {
                res.sendStatus(404);
            }
        })
    }
})

/* 管理员页 */
router.get('/admin', function (req, res) {
    if (req.session.user && req.session.user.type === '管理员') {
        res.render('admin', {
            user: req.session.user
        });
    } else {
        res.redirect('/');
    }
})

module.exports = router;