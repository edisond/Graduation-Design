var mongoose = require('mongoose');
var model = require('./model');
var Student = model.Student;
var Teacher = model.Teacher;
var Admin = model.Admin;
var OpenExperiment = model.OpenExperiment;
var md5 = require('../lib/md5');

var Dao = {

    /* 获取所有学生 */
    getStudents: function (callback) {
        Student.find({}, '-_id -__v -password -key', callback);
    },

    /* 新建一个学生 */
    /* 参数：student, callback(err) */
    /* @student-将要新建的学生, @err-将要返回的错误 */
    newStudent: function (student, callback) {
        var s = new Student(student);
        s.key = md5.md5(new Date());
        s.password = md5.md5(s.password + s.key);
        s.save(callback)
    },

    /* 更新一个学生 */
    /* 参数：student, callback(err) */
    /* @student-将要更新的学生, @err-将要返回的错误 */
    updateStudent: function (student, callback) {
        if (student.password) {
            student.key = md5.md5(new Date());
            student.password = md5.md5(student.password + student.key);
        }
        Student.findOneAndUpdate({
            'id': student.id
        }, student, function (err, docs) {
            if (!docs) {
                callback('Not found')
            } else {
                callback(err)
            }
        })
    },

    /* 验证学生密码 */
    /* 参数：student，callback(match) */
    /* @student-执行验证学生，@match-验证结果 */
    checkStudentPassword: function (student, callback) {
        Student.findOne({
            'id': student.id
        }, function (err, docs) {
            if (err || !docs) {
                callback(false);
            } else {
                if (md5.md5(student.password + docs.key) === docs.password) {
                    callback(true, docs);
                } else {
                    callback(false);
                }
            }
        });
    },

    /* 删除学生 */
    /* 参数：idList */
    /* @idList-待删除ID列表 */
    deleteStudents: function (idList, callback) {
        Student.remove({
            'id': {
                $in: idList
            }
        }, callback);
    },

    /* 获取所有教师 */
    /* 参数：callback(err, docs) */
    /* @err-将要返回的错误，@docs-将要返回的文档 */
    getTeachers: function (callback) {
        Teacher.find({}, '-_id -__v -password', callback);
    },

    /* 新建一个教师 */
    /* 参数：teacher, callback(err) */
    /* @teacher-将要新建的教师, @err-将要返回的错误 */
    newTeacher: function (teacher, callback) {
        var s = new Teacher(teacher);
        s.key = md5.md5(new Date());
        s.password = md5.md5(s.password + s.key);
        s.save(callback)
    },

    /* 更新一个教师 */
    /* 参数：teacher, callback(err) */
    /* @teacher-将要更新的教师, @err-将要返回的错误 */
    updateTeacher: function (teacher, callback) {
        if (teacher.password) {
            teacher.key = md5.md5(new Date());
            teacher.password = md5.md5(teacher.password + teacher.key);
        }
        Teacher.findOneAndUpdate({
            'id': teacher.id
        }, teacher, function (err, docs) {
            if (!docs) {
                callback('Not found')
            } else {
                callback(err)
            }
        })
    },

    /* 验证教师密码 */
    /* 参数：password，callback(match) */
    /* @teacher-执行验证教师，@match-验证结果 */
    checkTeacherPassword: function (teacher, callback) {
        Teacher.findOne({
            'id': teacher.id
        }, function (err, docs) {
            if (err || !docs) {
                callback(false);
            } else {
                if (md5.md5(teacher.password + docs.key) === docs.password) {
                    callback(true, docs);
                } else {
                    callback(false);
                }
            }
        });
    },

    /* 删除教师 */
    /* 参数：idList */
    /* @idList-待删除ID列表 */
    deleteTeachers: function (idList, callback) {
        Teacher.remove({
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

    /* 新建开放实验 */
    newOpenExperiment: function (openExperiment, callback) {
        var oe = new OpenExperiment(openExperiment);
        oe.save(callback)
    },

    /* 获取所有开放实验 */
    getOpenExperiments: function (callback) {
        OpenExperiment.find().lean().populate('teacher', 'name').exec(callback);
    },

    /* 获取一个开放实验 */
    getOpenExperiment: function (id, callback) {
        OpenExperiment.findOne({
            _id: id
        }).lean().populate('teacher', 'name department email phone').exec(callback);
    }
}

module.exports.Dao = Dao;