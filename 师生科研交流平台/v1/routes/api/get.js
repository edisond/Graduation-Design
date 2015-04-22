var express = require('express'),
    router = express.Router(),
    model = require('../../model/model');

router.get('/admin', function (req, res) {
    var fields = '_id';
    if (req.query.email) fields += ' email';
    model.User.findOne({
        type: '管理员'
    }, fields).lean().exec(function (err, doc) {
        if (err) res.sendStatus(500)
        else res.status(200).send(doc)
    })
})

router.get('/user', function (req, res) {
    if (req.session.user) {
        if (req.session.user.type === '管理员') {
            var condition = {};
            if (req.query.type) condition.type = req.query.type;
            model.User.find(condition, '-__v -password -key').lean().exec(function (err, docs) {
                if (err) res.sendStatus(500)
                else res.status(200).send(docs)
            });
        } else {
            if (req.query.self) {
                res.status(200).send(req.session.user)
            } else {
                req.sendStatus(404);
            }
        }
    } else {
        res.sendStatus(401)
    }
})

router.get('/comment', function (req, res) {
    var condition = {};
    if (req.query.project) condition.project = req.query.project;
    if (req.query.to) condition.to = req.query.to;
    model.Comment.find(condition).lean().populate('from to', 'name type img').populate('project', 'name').exec(function (err, docs) {
        if (err) res.sendStatus(500)
        else res.status(200).send(docs)
    });
})

router.get('/project', function (req, res) {
    var condition = {};
    if (req.query.type) condition.type = req.query.type;
    if (req.query.teacher) condition.teacher = req.query.teacher;
    if (req.query.q) condition.name = new RegExp(req.query.q);
    model.Project.find(condition, '-openExperimentAttr -challengeCupAttr -innovationProjectAttr').populate('teacher', 'name').populate('creator', 'name').lean().exec(function (err, docs) {
        if (err) res.sendStatus(500)
        else res.status(200).send(docs)
    })
})

router.get('/select', function (req, res) {
    if (req.query.teacher) {
        var condition = {
            teacher: req.query.teacher
        };
        if (req.query.active === 'true') condition.active = true
        else if (req.query.active === 'false') condition.active = false
        model.Project.find({
            teacher: condition.teacher
        }, function (err, docs) {
            if (err) res.sendStatus(500)
            else {
                var IdList = [];
                for (var i = 0, j = docs.length; i < j; i++) {
                    IdList.push(docs[i]._id);
                }
                model.Select.find({
                    project: {
                        $in: IdList
                    },
                    active: condition.active
                }).populate('student team', 'name').populate('project', 'name type').exec(function (err, docs) {
                    if (err) res.sendStatus(500)
                    else res.status(200).send(docs)
                });
            }
        })
    } else {
        var condition = {};
        if (req.query.student) condition.student = req.query.student
        if (req.query.project) condition.project = req.query.project
        if (req.query.team) condition.team = req.query.team
        if (req.query.active === 'true') condition.active = true
        else if (req.query.active === 'false') condition.active = false
        model.Select.find(condition).populate('student', 'name img').populate('team', 'name').populate('project', 'name type').exec(function (err, docs) {
            if (err) res.sendStatus(500)
            else res.status(200).send(docs)
        })
    }
})

router.get('/team', function (req, res) {
    var condition = {};
    if (req.query._id) condition._id = req.query._id;
    if (req.query.leader) condition.leader = req.query.leader;
    model.Team.find(condition).populate('leader', 'name type img').exec(function (err, docs) {
        if (err) res.sendStatus(500)
        else res.status(200).send(docs)
    })
})

router.get('/teamapply', function (req, res) {
    if (req.query.leader) {
        var condition = {
            leader: req.query.leader
        };
        if (req.query.active === 'true') condition.active = true
        else if (req.query.active === 'false') condition.active = false
        model.Team.find({
            leader: condition.leader
        }, function (err, docs) {
            if (err) res.sendStatus(500)
            else {
                var IdList = [];
                for (var i = 0, j = docs.length; i < j; i++) {
                    IdList.push(docs[i]._id);
                }
                model.TeamApply.find({
                    team: {
                        $in: IdList
                    },
                    active: condition.active
                }).populate('user', '_id name type').populate('team', 'name leader').exec(function (err, docs) {
                    if (err) res.sendStatus(500)
                    else res.status(200).send(docs)
                });
            }
        })
    } else {
        var condition = {};
        if (req.query.team) condition.team = req.query.team
        if (req.query.user) condition.user = req.query.user
        if (req.query.active === 'true') condition.active = true
        else if (req.query.active === 'false') condition.active = false
        model.TeamApply.find(condition).populate('team', 'name desc leader dateCreate').populate('user', '_id name img').exec(function (err, docs) {
            if (err) res.sendStatus(500)
            else res.status(200).send(docs)
        })
    }
})

module.exports = router;