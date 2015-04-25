var express = require('express'),
    router = express.Router(),
    session = require('express-session'),
    moment = require('moment'),
    model = require('../model/model'),
    captchapng = require('captchapng');

function genCap() {
    var num = "";
    for (var i = 0; i < 4; i++) {
        var tmp = Math.floor(Math.random() * 10);
        if (tmp === 0) tmp++;
        num += tmp.toString();
    }
    num = parseInt(num);
    var result = {},
        p = new captchapng(50, 25, num);
    p.color(0, 0, 0, 0);
    p.color(0, 93, 108);
    result.src = 'data:image/png;base64,' + p.getBase64();
    result.num = num;
    return result;
}

router.get('/', function (req, res) {
    model.User.count({
        type: '老师'
    }, function (err, utcount) {
        utcount = err ? 0 : utcount;
        model.User.count({
            type: '同学'
        }, function (err, uscount) {
            uscount = err ? 0 : uscount;
            model.Project.count({}, function (err, pcount) {
                pcount = err ? 0 : pcount;
                model.Team.count({}, function (err, tcount) {
                    tcount = err ? 0 : tcount;
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

router.get('/register', function (req, res) {
    if (req.session.user) {
        res.redirect('/center');
    } else {
        var cap = genCap();
        req.session.cap = cap.num;
        res.render('register', {
            user: req.session.user,
            capSrc: cap.src
        });
    }
})

router.get('/login', function (req, res) {
    if (req.session.user) {
        res.redirect('/center');
    } else {
        var cap = genCap();
        req.session.cap = cap.num;
        res.render('login', {
            user: req.session.user,
            capSrc: cap.src
        });
    }
})

router.get('/search', function (req, res) {
    res.render('search', {
        user: req.session.user
    });
})

router.get('/open-experiment', function (req, res) {
    res.render('project', {
        user: req.session.user,
        projectType: '开放实验项目'
    });
})

router.get('/challenge-cup', function (req, res) {
    res.render('project', {
        user: req.session.user,
        projectType: '挑战杯项目'
    });
})

router.get('/innovation-project', function (req, res) {
    res.render('project', {
        user: req.session.user,
        projectType: '科技创新工程项目'
    });
})

router.get('/project/:id', function (req, res, next) {
    model.Project.findById(req.params.id).populate('teacher', 'name department email phone').populate('creator', 'name type').lean().exec(function (err, docs) {
        if (docs) {
            docs.dateUpdate = moment(docs.dateUpdate).fromNow();
            docs.dateStart = moment(docs.dateStart).format('l');
            docs.dateEnd = moment(docs.dateEnd).format('l');
            var cap = genCap();
            req.session.cap = cap.num;
            if (docs.type === '开放实验项目') {
                if (req.session.user) {
                    var isSelected = false,
                        isApplied = false;
                    model.Select.findOne({
                        student: req.session.user._id,
                        project: docs._id
                    }, function (err, doc) {
                        if (doc) {
                            isSelected = doc.active;
                            isApplied = !doc.active;
                        }
                        res.render('projectView', {
                            project: docs,
                            user: req.session.user,
                            isSelected: isSelected,
                            isApplied: isApplied,
                            capSrc: cap.src
                        })
                    })
                } else {
                    res.render('projectView', {
                        project: docs,
                        capSrc: cap.src
                    })
                }
            } else {
                model.Select.findOne({
                    project: docs._id,
                    active: true
                }).populate('team', 'name').exec(function (err, doc) {
                    res.render('projectView', {
                        project: docs,
                        user: req.session.user,
                        team: doc && doc.team ? doc.team : undefined,
                        capSrc: cap.src
                    })
                })
            }
        } else {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        }
    })
})

router.get('/center', function (req, res) {
    if (req.session.user) {
        if (req.session.user.type === '管理员') {
            res.redirect('/admin');
        } else {
            res.render('center', {
                user: req.session.user
            });
        }
    } else {
        res.redirect('/login');
    }
})

router.get('/support', function (req, res) {
    res.render('support', {
        user: req.session.user
    });
})

router.get('/profile/:id', function (req, res) {
    model.User.findById(req.params.id, function (err, docs) {
        res.render('profile', {
            user: req.session.user,
            profile: docs
        });
    })
})

router.get('/team/:id?', function (req, res, next) {
    if (req.params.id) {
        model.Team.findById(req.params.id).populate('leader', 'name type email').lean().exec(function (err, docs) {
            if (docs) {
                docs.dateCreate = moment(docs.dateCreate).fromNow();
                if (req.session.user) {
                    var isSelected = false,
                        isApplied = false;
                    model.TeamApply.findOne({
                        user: req.session.user._id,
                        team: docs._id
                    }, function (err, doc) {
                        if (doc) {
                            isSelected = doc.active;
                            isApplied = !doc.active;
                        }
                        res.render('teamView', {
                            team: docs,
                            user: req.session.user,
                            isSelected: isSelected,
                            isApplied: isApplied
                        })
                    })
                } else {
                    res.render('teamView', {
                        team: docs
                    })
                }
            } else {
                var err = new Error('Not Found');
                err.status = 404;
                next(err);
            }
        })
    } else {
        res.render('team', {
            user: req.session.user
        });
    }
})

/* 管理员页 */
router.get('/admin', function (req, res) {
    if (req.session.user && req.session.user.type === '管理员') {
        res.render('admin', {
            user: req.session.user
        });
    } else {
        res.redirect('/login');
    }
})

module.exports = router;