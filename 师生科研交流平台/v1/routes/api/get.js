var express = require('express');
var router = express.Router();
var db = require('../../model/db');
var Dao = db.Dao;

/* Get user list */
router.get('/user', function (req, res) {
    if (req.session.admin) {
        var condition = {};
        if (req.query.type) condition.type = req.query.type;
        Dao.getUsers(condition, function (err, docs) {
            if (err) {
                res.sendStatus(500);
            } else {
                res.status(200).send(docs);
            }
        })
    } else if (req.session.user) {
        if (req.query.self) {
            var user = req.session.user;
            res.status(200).send(user)
        }
    } else {
        res.sendStatus(401)
    }

})

/* Get comment */
router.get('/comment', function (req, res) {
    if (req.session.user) {
        var condition = {};
        if (req.query.project) condition.project = req.query.project;
        if (req.query.to) condition.to = req.query.to;
        Dao.getComments(condition, function (err, docs) {
            if (err) {
                res.sendStatus(500)
            } else {
                res.status(200).send(docs);
            }
        })
    } else {
        res.sendStatus(401);
    }

})

/* Get project */
router.get('/project', function (req, res) {
    var condition = {};
    if (req.query.type) condition.type = req.query.type;
    if (req.query.teacher) condition.teacher = req.query.teacher;
    Dao.getProjects(condition, function (err, docs) {
        if (err) {
            res.sendStatus(500);
        } else {
            res.status(200).send(docs);
        }
    })
})

/* Get select */
router.get('/select', function (req, res) {
    if (req.session.user) {
        if (req.query.teacher) {
            var condition = {
                teacher: req.query.teacher
            };
            if (req.query.active === 'true') condition.active = true
            else if (req.query.active === 'false') condition.active = false
            Dao.getSelectsByTeacher(condition, function (err, docs) {
                if (err) {
                    res.sendStatus(500);
                } else {
                    res.status(200).send(docs);
                }
            })
        } else {
            var condition = {};
            if (req.query.student) condition.student = req.query.student
            if (req.query.project) condition.project = req.query.project
            if (req.query.team) condition.team = req.query.team
            if (req.query.active === 'true') condition.active = true
            else if (req.query.active === 'false') condition.active = false
            Dao.getSelects(condition, function (err, docs) {
                if (err) {
                    res.sendStatus(500);
                } else {
                    res.status(200).send(docs);
                }
            })
        }

    } else {
        res.sendStatus(401)
    }
})

/* Get team */
router.get('/team', function (req, res) {
    if (req.session.user) {
        var condition = {};
        if (req.query._id) condition._id = req.query._id;
        if (req.query.leader) condition.leader = req.query.leader;
        Dao.getTeams(condition, function (err, docs) {
            if (err) {
                console.log(err)
                res.sendStatus(500)
            } else {
                res.status(200).send(docs);
            }
        })
    } else {
        res.sendStatus(401)
    }
})

/* Get team apply */
router.get('/teamapply', function (req, res) {
    if (req.session.user) {
        if (req.query.leader) {
            var condition = {
                leader: req.query.leader
            };
            if (req.query.active === 'true') condition.active = true
            else if (req.query.active === 'false') condition.active = false
            Dao.getTeamAppliesByLeader(condition, function (err, docs) {
                if (err) {
                    res.sendStatus(500);
                } else {
                    res.status(200).send(docs);
                }
            })
        } else {
            var condition = {};
            if (req.query.team) condition.team = req.query.team
            if (req.query.user) condition.user = req.query.user
            if (req.query.active === 'true') condition.active = true
            else if (req.query.active === 'false') condition.active = false
            Dao.getTeamApplies(condition, function (err, docs) {
                if (err) {
                    res.sendStatus(500);
                } else {
                    res.status(200).send(docs);
                }
            })
        }
    } else {
        res.sendStatus(401)
    }
})

module.exports = router;