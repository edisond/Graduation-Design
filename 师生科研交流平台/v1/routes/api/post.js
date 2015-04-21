var express = require('express'),
    router = express.Router(),
    session = require('express-session'),
    db = require('../../model/db'),
    fs = require('fs'),
    path = require('path'),
    Dao = db.Dao,
    md5 = require('../../lib/md5'),
    xss = require('xss'),
    nodemailer = require("nodemailer");



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

/* 更新管理员 */
router.post('/update/admin', function (req, res) {
    if (req.body.op && req.body.np) {
        Dao.checkAdminPassword(req.body.op, function (match) {
            if (match) {
                var admin = {
                    password: req.body.np
                }
                Dao.updateAdmin(admin, function (err) {
                    res.sendStatus(err ? 500 : 200);
                })
            } else {
                res.sendStatus(401);
            }
        })
    } else if (req.body.email) {
        req.body.email = xss(req.body.email);
        Dao.updateAdmin(req.body, function (err) {
            res.sendStatus(err ? 500 : 200);
        })
    } else {
        res.sendStatus(404);
    }
});

/* 登录 */
router.post('/signin', function (req, res) {
    if (req.query.type === 'admin') {
        Dao.checkAdminPassword(req.body.password, function (match, doc) {
            if (match) {
                req.session.user = doc;
                res.sendStatus(200);
            } else {
                res.sendStatus(401);
            }
        })
    } else {
        var user = req.body;
        Dao.checkUserPassword(user, function (match, docs) {
            if (match) {
                if (docs.active) {
                    req.session.user = docs;
                    res.sendStatus(200);
                } else {
                    res.sendStatus(403);
                }
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
    if (req.session.user && req.session.user.type === '管理员') {
        if (req.query.action === "new") {
            xssUser(user);
            Dao.newUser(user, function (err) {
                res.sendStatus(err ? 500 : 200);
            })
        } else if (req.query.action === "update") {
            xssUser(user);
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
                    xssUser(user);
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
                        xssUser(user);
                        Dao.updateUser(user, function (err, docs) {
                            res.sendStatus(err ? 500 : 200);
                        })
                    }
                })
            } else {
                xssUser(user);
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
            xssUser(user);
            Dao.newUser(user, function (err) {
                console.log(err)
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
                xssProject(req.body);
                req.body.creator = req.body.teacher = req.session.user._id;
                Dao.newProject(req.body, function (err, doc) {
                    res.sendStatus(err ? 500 : 200);
                })
            } else if (req.query.action === 'update') {
                Dao.getProject(req.body._id, function (err, doc) {
                    if (err || !doc) {
                        res.sendStatus(500)
                    } else {
                        if (doc.teacher._id.toString() === req.session.user._id.toString()) {
                            xssProject(req.body);
                            Dao.updateProject(req.body, function (err) {
                                res.sendStatus(err ? 500 : 200);
                            })
                        } else {
                            res.sendStatus(401);
                        }
                    }
                })
            } else if (req.query.action === 'guide') {
                Dao.getProject(req.body._id, function (err, docs) {
                    if (err || !docs || docs.teacher) {
                        res.sendStatus(500)
                    } else {
                        var project = {
                            _id: req.body._id,
                            teacher: req.session.user._id,
                            creator: req.session.user._id,
                            active: true
                        }
                        Dao.updateProject(project, function (err) {
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
                req.body.active = false;
                req.body.creator = req.session.user._id;
                Dao.newProject(req.body, function (err, doc) {
                    res.sendStatus(err ? 500 : 200);
                })
            } else if (req.query.action === 'update') {
                delete req.body.active;
                Dao.getProject(req.body._id, function (err, doc) {
                    if (err || !doc) {
                        res.sendStatus(500)
                    } else {
                        if (doc.creator._id.toString() === req.session.user._id.toString()) {
                            xssProject(req.body);
                            Dao.updateProject(req.body, function (err) {
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
    } else {
        res.sendStatus(404)
    }
});

/* 讨论 */
router.post('/comment', function (req, res) {
    if (req.session.user._id === req.body.from) {
        if (req.query.action === "new") {
            xssComment(req.body);
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
        if (req.query.type === 'team') {
            Dao.getTeam(req.body.team, function (err, doc) {
                if (err || !doc) {
                    res.sendStatus(500)
                } else if (doc.leader._id == req.session.user._id) {
                    var select = {
                        team: req.body.team,
                        project: req.body._id
                    };
                    Dao.newSelect(select, function (err) {
                        if (err) {
                            res.sendStatus(err === '重复选课' ? 403 : 500)
                        } else {
                            res.sendStatus(200)
                        }
                    })
                } else {
                    res.sendStatus(401)
                }
            })

        } else {
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
                Dao.approveSelect(select, function (err) {
                    res.sendStatus(err ? 500 : 200);
                })
            } else if (action === 'reject' && req.session.user.type === "老师") {
                Dao.deleteSelectById(req.body._id, function (err) {
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
                        xssTeam(team);
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
        } else if (action === 'reject') {
            Dao.getTeamApply(req.body._id, function (err, doc) {
                if (err || !doc) {
                    res.sendStatus(500)
                } else {
                    if (doc.team.leader.toString() === req.session.user._id.toString()) {
                        Dao.deleteTeamApply(doc._id, function (err) {
                            res.sendStatus(err ? 500 : 200);
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
});

router.post('/email', function (req, res) {
    if (req.query.to === 'author') {
        var transporter = nodemailer.createTransport("SMTP", {
            service: 'Hotmail',
            auth: {
                user: 'jnussp@outlook.com',
                pass: '33635468gkr'
            }
        });
        console.log('SMTP Configured');
        var html = '';
        html += '<p>类型：' + xss(req.body.type) + '</p>';
        html += '<p>称呼：' + xss(req.body.name) + '</p>';
        html += '<p>邮箱：' + xss(req.body.email) + '</p>';
        html += '<p>标题：' + xss(req.body.title) + '</p>';
        html += '<p>内容：' + xss(req.body.body) + '</p>';
        var message = {
            from: "jnussp@outlook.com",
            to: "edisond@qq.com",
            subject: "用户反馈",
            html: html
        };
        console.log('Sending Mail');
        transporter.sendMail(message, function (error, info) {
            if (error) {
                console.log('Error occurred');
                console.log(error.message);
                res.sendStatus(500);
                transporter.close();
            } else {
                console.log('Message sent successfully!');
                console.log('Server responded with "%s"', info.response);
                res.sendStatus(200);
                transporter.close();
            }
        });

    } else {
        res.sendStatus(401)
    }
})

module.exports = router;