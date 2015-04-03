var mongoose = require('mongoose');
var model = require('./model');
var User = model.User;
var Admin = model.Admin;
var Project = model.Project;
var Select = model.Select;
var Comment = model.Comment;
var Team = model.Team;
var TeamApply = model.TeamApply;
var md5 = require('../lib/md5');

var Dao = {

    /* 获取所有用户 */
    getUsers: function (condition, callback) {
        User.find(condition, '-__v -password -key').lean().exec(callback);
    },

    getUser: function (_id, callback) {
        User.findById(_id, '-__v -password -key').lean().exec(callback);
    },

    /* 新建一个用户 */
    newUser: function (user, callback) {
        user.img = user.img || '/img/heads/' + user.type + '-default.jpg';
        user = new User(user);
        user.key = md5.md5(new Date());
        user.password = md5.md5(user.password + user.key);
        user.save(callback);
    },

    /* 更新一个用户 */
    updateUser: function (user, callback) {
        if (user.password) {
            user.key = md5.md5(new Date());
            user.password = md5.md5(user.password + user.key);
        }
        var condition = {
            _id: user._id
        };
        User.findOneAndUpdate(condition, user, callback)
    },

    /* 验证用户密码 */
    checkUserPassword: function (user, callback) {
        var condition = {};
        if (user.id) condition.id = user.id;
        if (user._id) condition._id = user._id;
        User.findOne(condition).lean().exec(function (err, docs) {
            if (err || !docs) {
                callback(false);
            } else {
                if (md5.md5(user.password + docs.key) === docs.password) {
                    delete docs.password;
                    delete docs.key;
                    delete docs.__v;
                    callback(true, docs);
                } else {
                    callback(false);
                }
            }
        });
    },

    /* 删除用户 */
    deleteUsers: function (idList, callback) {
        console.log(idList)
        User.update({
            _id: {
                $in: idList
            }
        }, {
            active: false
        }, {
            multi: true
        }, callback);
    },

    activeUsers: function (idList, callback) {
        User.update({
            _id: {
                $in: idList
            }
        }, {
            active: true
        }, {
            multi: true
        }, callback);
    },

    /* 验证管理员密码 */
    /* 参数：password，callback(match) */
    /* @password-执行验证的密码，@match-验证结果 */
    checkAdminPassword: function (password, callback) {
        Admin.findOne({}, function (err, docs) {
            if (err || !docs) {
                callback(false);
            } else {
                if (md5.md5(password + docs.key) === docs.password) {
                    callback(true);
                } else {
                    callback(false);
                }
            }
        });
    },

    /* 更新管理员密码 */
    /* 参数：admin，callback(err) */
    /* @password-新密码，@err-将要返回的错误 */
    updateAdmin: function (password, callback) {
        var key = md5.md5(new Date());
        var admin = {
            password: md5.md5(password + key),
            key: key
        }
        Admin.findOneAndUpdate({}, admin, callback)
    },

    /* 新建项目 */
    newProject: function (project, callback) {
        project = new Project(project);
        project.save(callback)
    },

    /* 获取项目 */
    getProjects: function (condition, callback) {
        Project.find(condition).populate('teacher', 'name').populate('creator', 'name').lean().exec(callback);
    },

    /* 获取一个开放实验 */
    getProject: function (_id, callback) {
        Project.findById(_id).populate('teacher', 'name department email phone img').populate('creator', 'name type').lean().exec(callback);
    },

    /* 更新开放实验 */
    updateProject: function (project, callback) {
        Project.findByIdAndUpdate(project._id, project, callback)
    },

    /* 删除开放实验 */
    deleteProject: function (_id, callback) {
        Project.findOneAndRemove({
            '_id': _id
        }, callback)
    },

    newSelect: function (select, callback) {
        Select.find({
            student: select.student,
            project: select.project
        }, function (err, docs) {
            if (err) {
                callback(err);
            } else if (docs.length > 0) {
                callback('重复选课');
            } else {
                select = new Select(select);
                select.save(callback);
            }
        })
    },

    getSelects: function (condition, callback) {
        Select.find(condition).populate('project', '_id name type dateStart dateEnd dateUpdate').populate('student', '_id name img').populate('team', 'name').lean().exec(callback);
    },

    getSelectsByTeacher: function (condition, callback) {
        Project.find({
            teacher: condition.teacher
        }, function (err, docs) {
            if (err) {
                callback(err)
            } else {
                var IdList = [];
                for (var i = 0, j = docs.length; i < j; i++) {
                    IdList.push(docs[i]._id);
                }
                Select.find({
                    project: {
                        $in: IdList
                    },
                    active: condition.active
                }).populate('student', '-__v -password -key').populate('project', 'name type').lean().exec(callback);
            }
        })
    },

    updateSelect: function (select, callback) {
        Select.findOneAndUpdate({
            _id: select._id
        }, select, callback)
    },

    deleteSelect: function (condition, callback) {
        Select.findOneAndRemove(condition, callback);
    },

    /* 新建讨论 */
    newComment: function (comment, callback) {
        comment = new Comment(comment);
        comment.save(callback)
    },

    /* 获取讨论 */
    getComments: function (condition, callback) {
        Comment.find(condition).lean().populate('from to', 'name type img').populate('project', 'name').exec(callback);
    },

    newTeam: function (team, callback) {
        team = new Team(team);
        team.save(callback);
    },

    getTeam: function (_id, callback) {
        Team.findById(_id).populate('leader', 'name type img').lean().exec(callback)
    },

    getTeams: function (condition, callback) {
        Team.find(condition, '-__v').lean().exec(callback)
    },

    newTeamApply: function (ta, callback) {
        TeamApply.find({
            user: ta.user,
            team: ta.team
        }, function (err, docs) {
            if (err) {
                callback(err);
            } else if (docs.length > 0) {
                callback('重复申请');
            } else {
                ta = new TeamApply(ta);
                ta.save(callback);
            }
        })
    },

    getTeamApply: function (_id, callback) {
        TeamApply.findById(_id).lean().exec(callback);
    },

    getTeamApplies: function (condition, callback) {
        TeamApply.find(condition).populate('team', 'name desc date leader').populate('user', '_id name type img').lean().exec(callback);
    },

    getTeamAppliesByLeader: function (condition, callback) {
        Team.find({
            leader: condition.leader
        }, function (err, docs) {
            if (err) {
                callback(err)
            } else {
                var IdList = [];
                for (var i = 0, j = docs.length; i < j; i++) {
                    IdList.push(docs[i]._id);
                }
                TeamApply.find({
                    team: {
                        $in: IdList
                    },
                    active: condition.active
                }).populate('user', '-__v -password -key').populate('team', 'name desc').lean().exec(callback);
            }
        })
    },

    updateTeamApply: function (ta, callback) {
        TeamApply.findByIdAndUpdate(ta._id, ta, callback)
    },

    deleteTeamApply: function (condition, callback) {
        TeamApply.findOneAndRemove(condition, callback);
    }

}

module.exports.Dao = Dao;