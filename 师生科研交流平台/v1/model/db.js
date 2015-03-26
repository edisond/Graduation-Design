var mongoose = require('mongoose');
var model = require('./model');
var User = model.User;
var Admin = model.Admin;
var Project = model.Project;
var Comment = model.Comment;
var md5 = require('../lib/md5');

var Dao = {

    /* 获取所有用户 */
    getUsers: function (type, callback) {
        var options = {};
        if (type) {
            options.type = type;
        }
        User.find(options, '-_id -__v -password -key').lean().exec(callback);
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
        User.findOneAndUpdate({
            'id': user.id
        }, user, callback)
    },

    /* 验证用户密码 */
    checkUserPassword: function (user, callback) {
        User.findOne({
            'id': user.id
        }, function (err, docs) {
            if (err || !docs) {
                callback(false);
            } else {
                if (md5.md5(user.password + docs.key) === docs.password) {
                    callback(true, docs);
                } else {
                    callback(false);
                }
            }
        });
    },

    /* 删除用户 */
    deleteUsers: function (idList, callback) {
        User.remove({
            'id': {
                $in: idList
            }
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
        Project = new Project(project);
        Project.save(callback)
    },

    /* 获取项目 */
    getProjects: function (condition, callback) {
        Project.find(condition).lean().populate('teacher', 'name').exec(callback);
    },

    /* 获取一个开放实验 */
    getProject: function (id, callback) {
        Project.findOne({
            _id: id
        }).populate('teacher', 'name department email phone img').populate('selected applied', 'name img').lean().exec(callback);
    },

    /* 更新开放实验 */
    updateProject: function (project, callback) {
        Project.findOneAndUpdate({
            '_id': project._id
        }, project, callback)
    },

    /* 删除开放实验 */
    deleteProject: function (_id, callback) {
        Project.findOneAndRemove({
            '_id': _id
        }, callback)
    },


    /* 新建讨论 */
    newComment: function (comment, callback) {
        comment = new Comment(comment);
        comment.save(callback)
    },

    /* 获取讨论 */
    getComments: function (condiction, callback) {
        Comment.find(condiction).lean().populate('from to', 'name type img').populate('project', 'name').exec(callback);
    }

}

module.exports.Dao = Dao;