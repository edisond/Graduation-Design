var express = require('express'),
    router = express.Router(),
    session = require('express-session'),
    fs = require('fs'),
    path = require('path'),
    xss = require('xss'),
    crypto = require('crypto'),
    model = require('../../model/model');

function md5(text) {
    return crypto.createHash('md5').update(text.toString()).digest('hex');
};

xss.whiteList['strike'] = [];

function xssUser(user) {
    if (user.id) user.id = xss(user.id);
    if (user.name) user.name = xss(user.name);
    if (user.img) user.img = xss(user.img);
    if (user.email) user.email = xss(user.email);
    if (user.phone) user.phone = xss(user.phone);
    if (user.studentAttr) {
        if (user.studentAttr.college) user.studentAttr.college = xss(user.studentAttr.college);
        if (user.studentAttr.major) user.studentAttr.major = xss(user.studentAttr.major);
        if (user.studentAttr.grade) user.studentAttr.grade = xss(user.studentAttr.grade);
        if (user.studentAttr.studentType) user.studentAttr.studentType = xss(user.studentAttr.studentType);
        if (user.studentAttr.address) user.studentAttr.address = xss(user.studentAttr.address);
    }
    if (user.teacherAttr) {
        if (user.teacherAttr.department) user.teacherAttr.department = xss(user.teacherAttr.department);
        if (user.teacherAttr.title) user.teacherAttr.title = xss(user.teacherAttr.title);
    }
}

function xssProject(project) {
    if (project.name) project.name = xss(project.name);
    if (project.description) project.description = xss(project.description);
    if (project.college) project.college = xss(project.college);
    if (project.openExperimentAttr) {
        if (project.openExperimentAttr.detail) project.openExperimentAttr.detail = xss(project.openExperimentAttr.detail);
        if (project.openExperimentAttr.requirement) project.openExperimentAttr.requirement = xss(project.openExperimentAttr.requirement);
        if (project.openExperimentAttr.lab) project.openExperimentAttr.lab = xss(project.openExperimentAttr.lab);
        if (project.openExperimentAttr.source) project.openExperimentAttr.source = xss(project.openExperimentAttr.source);
        if (project.openExperimentAttr.result) project.openExperimentAttr.result = xss(project.openExperimentAttr.result);
        if (project.openExperimentAttr.object) project.openExperimentAttr.object = xss(project.openExperimentAttr.object);
    }
    if (project.challengeCupAttr) {
        if (project.challengeCupAttr.ccBasis) project.challengeCupAttr.ccBasis = xss(project.challengeCupAttr.ccBasis);
        if (project.challengeCupAttr.ccGoal) project.challengeCupAttr.ccGoal = xss(project.challengeCupAttr.ccGoal);
        if (project.challengeCupAttr.ccStatus) project.challengeCupAttr.ccStatus = xss(project.challengeCupAttr.ccStatus);
        if (project.challengeCupAttr.ccUsage) project.challengeCupAttr.ccUsage = xss(project.challengeCupAttr.ccUsage);
        if (project.challengeCupAttr.ccCondition) project.challengeCupAttr.ccCondition = xss(project.challengeCupAttr.ccCondition);
        if (project.challengeCupAttr.ccSchedule) project.challengeCupAttr.ccSchedule = xss(project.challengeCupAttr.ccSchedule);
        if (project.challengeCupAttr.ccTeam) project.challengeCupAttr.ccTeam = xss(project.challengeCupAttr.ccTeam);
        if (project.challengeCupAttr.ccFund) project.challengeCupAttr.ccFund = xss(project.challengeCupAttr.ccFund);
        if (project.challengeCupAttr.ccDBasic) project.challengeCupAttr.ccDBasic = xss(project.challengeCupAttr.ccDBasic);
        if (project.challengeCupAttr.ccDMarket) project.challengeCupAttr.ccDMarket = xss(project.challengeCupAttr.ccDMarket);
        if (project.challengeCupAttr.ccDManage) project.challengeCupAttr.ccDManage = xss(project.challengeCupAttr.ccDManage);
    }
    if (project.innovationProjectAttr) {
        if (project.innovationProjectAttr.ipDetail) project.innovationProjectAttr.ipDetail = xss(project.innovationProjectAttr.ipDetail);
        if (project.innovationProjectAttr.ipKeywords) project.innovationProjectAttr.ipKeywords = xss(project.innovationProjectAttr.ipKeywords);
        if (project.innovationProjectAttr.ipBasis) project.innovationProjectAttr.ipBasis = xss(project.innovationProjectAttr.ipBasis);
        if (project.innovationProjectAttr.ipSchedule) project.innovationProjectAttr.ipSchedule = xss(project.innovationProjectAttr.ipSchedule);
        if (project.innovationProjectAttr.ipCondition) project.innovationProjectAttr.ipCondition = xss(project.innovationProjectAttr.ipCondition);
        if (project.innovationProjectAttr.ipFund) project.innovationProjectAttr.ipFund = xss(project.innovationProjectAttr.ipFund);
    }
}

function xssTeam(team) {
    if (team.name) team.name = xss(team.name);
    if (team.desc) team.desc = xss(team.desc);
}

function xssComment(comment) {
    if (comment.body) comment.body = xss(comment.body);
}

router.post('/signin', function (req, res) {
    if (req.query.type === 'admin') {
        model.User.findOne({
            type: '管理员'
        }, function (err, doc) {
            if (err) res.sendStatus(500)
            else if (doc) {
                if (md5(req.body.password + doc.key) === doc.password) {
                    req.session.user = doc;
                    res.sendStatus(200);
                } else {
                    res.sendStatus(401);
                }
            } else {
                var user = new model.User({
                    id: 'admin',
                    name: 'admin',
                    type: '管理员',
                    img: '/img/heads/管理员默认头像.png',
                    key: md5(new Date()),
                    active: true
                });
                user.password = md5(md5('admin') + user.key);
                user.email = '未设置邮箱';
                user.save(function (err, _doc) {
                    if (err) res.sendStatus(500)
                    else {
                        req.session.user = _doc;
                        res.sendStatus(200);
                    }
                })
            }
        });
    } else {
        var condition = {};
        if (req.body.id) condition.id = req.body.id;
        if (req.body._id) condition._id = req.body._id;
        model.User.findOne(condition).lean().exec(function (err, doc) {
            if (err || !doc) {
                res.sendStatus(401);
            } else {
                if (md5(req.body.password + doc.key) === doc.password) {
                    if (doc.active) {
                        delete doc.password;
                        delete doc.key;
                        delete doc.__v;
                        req.session.user = doc;
                        res.sendStatus(200);
                    } else res.sendStatus(403);
                } else {
                    res.sendStatus(401);
                }
            }
        });
    }
})

router.post('/signout', function (req, res) {
    req.session.destroy();
    res.sendStatus(200);
})

router.post('/user', function (req, res) {
    var user = req.body;
    if (req.session.user) {
        if (req.session.user.type === '管理员') {
            if (req.query.action === "new") {
                xssUser(user);
                user.img = user.img || '/img/heads/' + user.type + '默认头像.png';
                user.key = md5(new Date());
                user.password = md5(user.password + user.key);
                user = new model.User(user);
                user.save(function (err) {
                    res.sendStatus(err ? 500 : 200);
                });
            } else if (req.query.action === "update") {
                xssUser(user);
                delete user.key;
                if (user.password) {
                    user.key = md5(new Date());
                    user.password = md5(user.password + user.key);
                }
                model.User.findByIdAndUpdate(user._id, user, function (err) {
                    res.sendStatus(err ? 500 : 200);
                })
            } else if (req.query.action === "delete") {
                model.User.update({
                    _id: {
                        $in: user._id
                    }
                }, {
                    active: false
                }, {
                    multi: true
                }, function (err, doc) {
                    res.sendStatus(err ? 500 : 200);
                });
            } else if (req.query.action === "active") {
                model.User.update({
                    _id: {
                        $in: user._id
                    }
                }, {
                    active: true
                }, {
                    multi: true
                }, function (err, doc) {
                    res.sendStatus(err ? 500 : 200);
                });
            } else {
                res.sendStatus(404);
            }
        } else {
            user._id = req.session.user._id;
            user.id = req.session.user.id;
            if (req.query.action === "pwd" && req.body.op && req.body.np) {
                model.User.findById(user._id, function (err, doc) {
                    if (err || !doc) {
                        res.sendStatus(500);
                    } else {
                        if (md5(req.body.op + doc.key) === doc.password) {
                            user.key = md5(new Date());
                            user.password = md5(req.body.np + user.key);
                            model.User.findByIdAndUpdate(user._id, user, function (err) {
                                res.sendStatus(err ? 500 : 200);
                            })
                        } else {
                            res.sendStatus(401);
                        }
                    }
                });
            } else if (req.query.action === "update") {
                if (user.img) {
                    var base64Data = user.img.replace(/^data:image\/\w+;base64,/, "");
                    var dataBuffer = new Buffer(base64Data, 'base64');
                    fs.writeFileSync("public/img/heads/" + req.session.user._id + ".png", dataBuffer);
                    user.img = "/img/heads/" + req.session.user._id + ".png";
                }
                xssUser(user);
                model.User.findByIdAndUpdate(user._id, user, function (err, docs) {
                    res.sendStatus(err ? 500 : 200);
                })
            } else {
                res.sendStatus(404)
            }
        }
    } else {
        if (req.query.action && req.query.action === 'new') {
            user.active = false;
            xssUser(user);
            user.img = user.img || '/img/heads/' + user.type + '默认头像.png';
            user.key = md5(new Date());
            user.password = md5(user.password + user.key);
            user = new model.User(user);
            user.save(function (err) {
                res.sendStatus(err ? 500 : 200);
            });
        } else {
            res.sendStatus(404)
        }
    }

});

router.post('/project', function (req, res) {
    if (!req.query.action) {
        res.sendStatus(404)
    } else if (!req.session.user) {
        res.sendStatus(401)
    } else {
        if (req.session.user.type === '老师') {
            if (req.query.action === 'new') {
                xssProject(req.body);
                req.body.creator = req.body.teacher = req.session.user._id;
                var project = new model.Project(req.body);
                project.save(function (err, doc) {
                    res.sendStatus(err ? 500 : 200);
                })
            } else if (req.query.action === 'update') {
                model.Project.findById(req.body._id, function (err, doc) {
                    if (err || !doc) {
                        res.sendStatus(500)
                    } else {
                        if (doc.creator.toString() === req.session.user._id.toString()) {
                            xssProject(req.body);
                            model.Project.findByIdAndUpdate(req.body._id, req.body, function (err) {
                                res.sendStatus(err ? 500 : 200);
                            })
                        } else {
                            res.sendStatus(401);
                        }
                    }
                })
            } else if (req.query.action === 'guide') {
                model.Project.findById(req.body._id, function (err, doc) {
                    if (err || !doc || doc.teacher) {
                        res.sendStatus(500)
                    } else {
                        var project = {
                            _id: req.body._id,
                            teacher: req.session.user._id,
                            creator: req.session.user._id
                        }
                        model.Project.findByIdAndUpdate(project._id, project, function (err) {
                            res.sendStatus(err ? 500 : 200);
                        })
                    }
                })
            } else {
                res.sendStatus(404);
            }
        } else if (req.session.user.type === '同学') {
            if (req.query.action === 'new') {
                xssProject(req.body);
                req.body.creator = req.session.user._id;
                var project = new model.Project(req.body);
                project.save(function (err, doc) {
                    res.sendStatus(err ? 500 : 200);
                })
            } else if (req.query.action === 'update') {
                model.Project.findById(req.body._id, function (err, doc) {
                    if (err || !doc) {
                        res.sendStatus(500)
                    } else {
                        if (doc.creator.toString() === req.session.user._id.toString()) {
                            xssProject(req.body);
                            model.Project.findByIdAndUpdate(req.body._id, req.body, function (err) {
                                res.sendStatus(err ? 500 : 200);
                            })
                        } else {
                            res.sendStatus(401);
                        }
                    }
                })
            } else {
                res.sendStatus(404);
            }
        } else {
            res.sendStatus(401)
        }
    }
});

router.post('/comment', function (req, res) {
    if (req.session.user) {
        if (req.query.action === "new") {
            req.body.from = req.session.user._id;
            xssComment(req.body);
            var comment = new model.Comment(req.body);
            comment.save(function (err) {
                res.sendStatus(err ? 500 : 200)
            })
        } else {
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(401);
    }
});

router.post('/select', function (req, res) {
    if (req.session.user) {
        var action = req.query.action;
        if (req.query.type === 'team') {
            if (action === 'apply') {
                model.Team.findById(req.body.team, function (err, doc) {
                    if (err || !doc) {
                        res.sendStatus(500)
                    } else if (doc.leader.toString() === req.session.user._id.toString()) {
                        var select = {
                            team: req.body.team,
                            project: req.body.project
                        };
                        model.Select.findOne(select, function (err, doc) {
                            if (err) res.sendStatus(500)
                            else if (doc) res.sendStatus(403)
                            else {
                                select = new model.Select(select);
                                select.save(function (err) {
                                    res.sendStatus(err ? 500 : 200)
                                });
                            }
                        })
                    } else {
                        res.sendStatus(401)
                    }
                })
            } else {
                res.sendStatus(404)
            }
        } else {
            if (action === 'apply' && req.session.user.type === "同学") {
                var select = {
                    student: req.session.user._id,
                    project: req.body._id
                };
                model.Select.findOne(select, function (err, doc) {
                    if (err) res.sendStatus(500)
                    else if (doc) res.sendStatus(403)
                    else {
                        select = new model.Select(select);
                        select.save(function (err) {
                            res.sendStatus(err ? 500 : 200)
                        });
                    }
                })
            } else if (action === 'cancel' && req.session.user.type === "同学") {
                var select = {
                    student: req.session.user._id,
                    project: req.body._id
                };
                model.Select.findOneAndRemove(select, function (err) {
                    res.sendStatus(err ? 500 : 200);
                })
            } else if (action === 'approve' && req.session.user.type === "老师") {
                var select = req.body;
                select.active = true;
                model.Select.findByIdAndUpdate(select._id, select, function (err, doc) {
                    if (!err && doc.team) {
                        model.Select.remove({
                            project: doc.project,
                            _id: {
                                $ne: doc._id
                            }
                        }, function (err) {
                            res.sendStatus(err ? 500 : 200);
                        })
                    } else {
                        res.sendStatus(err ? 500 : 200);
                    }
                })
            } else if (action === 'reject' && req.session.user.type === "老师") {
                model.Select.findByIdAndRemove(req.body._id, function (err) {
                    res.sendStatus(err ? 500 : 200);
                })
            } else {
                res.sendStatus(404);
            }
        }
    } else {
        res.sendStatus(401);
    }
});

router.post('/team', function (req, res) {
    if (req.session.user && req.session.user.type === "同学") {
        var action = req.query.action;
        if (action === 'new') {
            var team = {
                name: req.body.name,
                leader: req.session.user._id,
                desc: req.body.desc
            }
            model.Team.find({
                leader: team.leader
            }, function (err, docs) {
                if (err) res.sendStatus(500)
                else {
                    if (docs.length < 5) {
                        xssTeam(team);
                        team = new model.Team(team);
                        team.save(function (err, doc) {
                            if (err) res.sendStatus(500)
                            else {
                                var teamapply = new model.TeamApply({
                                    user: doc.leader,
                                    active: true,
                                    team: doc._id
                                });
                                teamapply.save(function (err) {
                                    res.sendStatus(err ? 500 : 200);
                                })
                            }
                        })
                    } else {
                        res.sendStatus(403);
                    }
                }
            })

        } else if (action === 'update') {
            model.Team.findByIdAndUpdate(req.body._id, req.body, function (err) {
                res.sendStatus(err ? 500 : 200);
            })
        } else if (action === 'delete') {
            model.Team.findById(req.body._id, function (err, doc) {
                if (err) res.sendStatus(500)
                else {
                    if (doc.leader.toString() === req.session.user._id.toString()) {
                        model.Team.findByIdAndRemove(req.body._id, function () {
                            model.TeamApply.remove({
                                team: req.body._id
                            }, function () {
                                model.Select.remove({
                                    team: req.body._id
                                }, function () {
                                    res.sendStatus(200);
                                })
                            })
                        })
                    } else {
                        res.sendStatus(401)
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
            model.TeamApply.findOne(teamapply, function (err, doc) {
                if (err || doc) res.sendStatus(500)
                else {
                    teamapply = new model.TeamApply(teamapply);
                    teamapply.save(function (err) {
                        res.sendStatus(err ? 500 : 200);
                    });
                }
            })
        } else if (action === 'cancel') {
            var teamapply = {
                user: req.session.user._id,
                team: req.body._id
            };
            model.TeamApply.findOneAndRemove(teamapply, function (err) {
                res.sendStatus(err ? 500 : 200);
            })
        } else if (action === 'approve') {
            var teamapply = req.body;
            model.Team.findById(teamapply.team, function (err, doc) {
                if (err || !doc) res.sendStatus(500)
                else {
                    if (doc.leader.toString() === req.session.user._id.toString()) {
                        teamapply.active = true;
                        model.TeamApply.findByIdAndUpdate(teamapply._id, teamapply, function (err) {
                            res.sendStatus(err ? 500 : 200);
                        })
                    } else {
                        res.sendStatus(401)
                    }
                }
            })
        } else if (action === 'reject') {
            model.TeamApply.findById(req.body._id).populate('team', 'leader').exec(function (err, doc) {
                if (err || !doc) {
                    res.sendStatus(500)
                } else {
                    if (doc.team.leader.toString() === req.session.user._id.toString()) {
                        model.TeamApply.findByIdAndRemove(req.body._id, function (err) {
                            res.sendStatus(err ? 500 : 200);
                        })
                    } else {
                        res.sendStatus(401)
                    }
                }
            })
        } else if (action === 'exit') {
            model.TeamApply.findOneAndRemove({
                user: req.session.user._id,
                team: req.body._id
            }, function (err, doc) {
                res.sendStatus(err ? 500 : 200);
            })
        } else {
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(401);
    }
});

router.post('/update/admin', function (req, res) {
    if (req.session.user && req.session.user.type === '管理员') {
        if (req.body.op && req.body.np) {
            model.User.findOne({
                type: '管理员'
            }, function (err, doc) {
                if (err || !doc) res.sendStatus(500)
                else {
                    if (md5(req.body.op + doc.key) === doc.password) {
                        var user = {};
                        user.key = md5(new Date());
                        user.password = md5(req.body.np + user.key);
                        model.User.findByIdAndUpdate(doc._id, user, function (err) {
                            res.sendStatus(err ? 500 : 200);
                        })
                    } else {
                        res.sendStatus(401)
                    }
                }
            });
        } else if (req.body.email) {
            req.body.email = xss(req.body.email);
            model.User.findOneAndUpdate({
                type: '管理员'
            }, req.body, function (err) {
                res.sendStatus(err ? 500 : 200);
            })
        } else {
            res.sendStatus(404);
        }
    } else res.sendStatus(401)
});

router.post('/email', function (req, res) {
    res.sendStatus(200);
})

module.exports = router;