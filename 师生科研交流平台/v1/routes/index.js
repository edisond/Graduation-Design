var express = require('express');
var router = express.Router();
var session = require('express-session');
var moment = require('moment');
var db = require('../model/db');
var Dao = db.Dao;

/* 主页 */
router.get('/', function (req, res) {
    res.render('index', {
        user: req.session.user
    });
})

/* 开放实验列表页 */
router.get('/open-experiment', function (req, res) {
    res.render('openExperiment', {
        user: req.session.user
    });
})

/* 开放实验新建页 */
router.get('/open-experiment/new', function (req, res) {
    if (req.session.user && req.session.user.type === 'teacher') {
        res.render('openExperimentNew', {
            user: req.session.user
        });
    } else {
        res.redirect('/');
    }
})

/* 开放实验页 */
router.get('/open-experiment/:id', function (req, res) {
    if (req.session.user) {
        Dao.getOpenExperiment(req.params.id, function (err, docs) {
            if (docs) {
                docs.dateUpdate = moment(docs.dateUpdate).fromNow();
                docs.dateStart = moment(docs.dateStart).format('l');
                docs.dateEnd = moment(docs.dateEnd).format('l');
                var isSelected = false,
                    isApplied = false;
                for (var i = 0, j = docs.select.length; i < j; i++) {
                    if (docs.select[i]._id.toString() === req.session.user._id) {
                        isSelected = true;
                        break;
                    }
                }
                for (var i = 0, j = docs.apply.length; i < j; i++) {
                    if (docs.apply[i]._id.toString() === req.session.user._id) {
                        isApplied = true;
                        break;
                    }
                }

                res.render('openExperimentView', {
                    openExperiment: docs,
                    user: req.session.user,
                    isSelected: isSelected,
                    isApplied: isApplied
                })
            } else res.sendStatus(404);
        })
    } else {
        res.redirect('/open-experiment');
    }
})



/* 挑战杯列表页 */
router.get('/cc', function (req, res) {
    res.render('cc', {
        user: req.session.user
    });
})

/* 挑战杯新建页 */
router.get('/cc/new', function (req, res) {
    if (req.session.user) {
        res.render('cc/new', {
            user: req.session.user
        });
    } else {
        res.redirect('cc');
    }
})

/* 创新项目列表页 */
router.get('/ip', function (req, res) {
    res.render('ip', {
        user: req.session.user
    });
})


/* 个人中心页 */
router.get('/center', function (req, res) {
    if (req.session.user && req.session.user.type === 'student') {
        res.render('student/center', {
            user: req.session.user
        });
    } else if (req.session.user && req.session.user.type === 'teacher') {
        res.render('teacher/center', {
            user: req.session.user
        });
    } else {
        res.redirect('/');
    }
})


/* 管理员页 */
router.get('/admin', function (req, res) {
    if (req.session.admin) {
        res.render('admin');
    } else {
        //        res.redirect('/');
        req.session.admin = 'admin';
        res.render('admin');
    }
})

module.exports = router;