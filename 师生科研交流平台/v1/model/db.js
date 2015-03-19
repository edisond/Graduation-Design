var mongoose = require('mongoose');
var model = require('./model');
var Student = model.Student;
var Teacher = model.Teacher;
var Admin = model.Admin;
var Key = model.Key;
var md5 = require('../lib/md5');

var Dao = {

    /* 获取所有学生 */
    /* 参数：callback(err, docs) */
    /* @err-将要返回的错误，@docs-将要返回的文档 */
    getStudents: function (callback) {
        Student.find({}, '-_id -__v -password', function (err, docs) {
            callback(err, docs);
        });
    },

    /* 新建一个学生 */
    /* 参数：student, callback(err) */
    /* @student-将要新建的学生, @err-将要返回的错误 */
    newStudent: function (student, callback) {
        var s = new Student();
        var key = new Key();
        key.key = md5.md5(new Date());
        key.type = "student";
        key.for = s._id;
        s.id = student.id || '';
        s.name = student.name || '';
        s.sex = student.sex || '';
        s.college = student.college || '';
        s.major = student.major || '';
        s.grade = student.grade || '';
        s.type = student.type || '';
        s.email = student.email || '';
        s.phone = student.phone || '';
        s.address = student.address || '';
        s.active = student.active || false;
        s.password = md5.md5(student.password + key.key);
        Student.findOne({
            'id': s.id
        }, function (err, docs) {
            if (docs) {
                callback('Already Exist')
            } else {
                key.save(function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        s.save(function (err) {
                            callback(err);
                        })
                    }
                })
            }
        })
    },

    /* 更新一个学生 */
    /* 参数：student, callback(err) */
    /* @student-将要更新的学生, @err-将要返回的错误 */
    updateStudent: function (student, callback) {
        var s = {};
        if (typeof student.name !== 'undefined') {
            s.name = student.name;
        }
        if (typeof student.sex !== 'undefined') {
            s.sex = student.sex;
        }
        if (typeof student.college !== 'undefined') {
            s.college = student.college;
        }
        if (typeof student.major !== 'undefined') {
            s.major = student.major;
        }
        if (typeof student.grade !== 'undefined') {
            s.grade = student.grade;
        }
        if (typeof student.type !== 'undefined') {
            s.type = student.type;
        }
        if (typeof student.email !== 'undefined') {
            s.email = student.email;
        }
        if (typeof student.phone !== 'undefined') {
            s.phone = student.phone;
        }
        if (typeof student.address !== 'undefined') {
            s.address = student.address;
        }
        if (typeof student.active !== 'undefined') {
            s.active = student.active;
        }
        Student.findOneAndUpdate({
            'id': student.id
        }, s, function (err, docs) {
            if (!docs) {
                callback('Not found')
            } else {
                callback(err)
            }
        })
    },

    /* 更新学生密码 */
    /* 参数：student，callback(err) */
    /* @student-待更新学生，@err-将要返回的错误 */
    updateStudentPassword: function (student, callback) {
        var key = {
            key: md5.md5(new Date()),
            type: "student"
        };
        var s = {
            password: md5.md5(student.password + key.key)
        }
        Student.findOneAndUpdate({
            'id': student.id
        }, s, function (err, docs) {
            if (err) {
                callback(err);
            } else {
                key.for = docs._id;
                var condition = {
                    'for': key.for,
                    'type': key.type
                };
                var option = {
                    upsert: true
                };
                Key.findOneAndUpdate(condition, key, option, function (err, docs) {
                    callback(err);
                })
            }
        })
    },

    /* 验证学生密码 */
    /* 参数：password，callback(match) */
    /* @student-执行验证学生，@match-验证结果 */
    checkStudentPassword: function (student, callback) {
        Student.findOne({
            'id': student.id
        }, function (err, docs) {
            if (err || !docs) {
                callback(false);
            } else {
                var condition = {
                    'for': docs._id,
                    'type': 'student',
                };
                Key.findOne(condition, function (err, _docs) {
                    if (err || !_docs) {
                        callback(false);
                    } else {
                        if (md5.md5(student.password + _docs.key) === docs.password) {
                            callback(true, docs);
                        } else {
                            callback(false);
                        }
                    }
                })
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
        }, function (err, docs) {
            callback(err)
        });
    },

    /* 获取所有教师 */
    /* 参数：callback(err, docs) */
    /* @err-将要返回的错误，@docs-将要返回的文档 */
    getTeachers: function (callback) {
        Teacher.find({}, '-_id -__v -password', function (err, docs) {
            callback(err, docs);
        });
    },

    /* 新建一个教师 */
    /* 参数：teacher, callback(err) */
    /* @teacher-将要新建的教师, @err-将要返回的错误 */
    newTeacher: function (teacher, callback) {
        var t = new Teacher();
        var key = new Key();
        key.key = md5.md5(new Date());
        key.type = "teacher";
        key.for = t._id;
        t.id = teacher.id || '';
        t.name = teacher.name || '';
        t.sex = teacher.sex || '';
        t.department = teacher.department || '';
        t.title = teacher.title || '';
        t.email = teacher.email || '';
        t.phone = teacher.phone || '';
        t.active = teacher.active || false;
        t.password = md5.md5(teacher.password + key.key);
        Teacher.findOne({
            'id': t.id
        }, function (err, docs) {
            if (docs) {
                callback('Already Exist')
            } else {
                key.save(function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        t.save(function (err) {
                            callback(err);
                        })
                    }
                })
            }
        })
    },

    /* 更新一个教师 */
    /* 参数：teacher, callback(err) */
    /* @teacher-将要更新的教师, @err-将要返回的错误 */
    updateTeacher: function (teacher, callback) {
        var t = {};
        if (typeof teacher.name !== 'undefined') {
            t.name = teacher.name;
        }
        if (typeof teacher.sex !== 'undefined') {
            t.sex = teacher.sex;
        }
        if (typeof teacher.department !== 'undefined') {
            t.department = teacher.department;
        }
        if (typeof teacher.title !== 'undefined') {
            t.title = teacher.title;
        }
        if (typeof teacher.active !== 'undefined') {
            t.active = teacher.active;
        }
        if (typeof teacher.phone !== 'undefined') {
            t.phone = teacher.phone;
        }
        if (typeof teacher.email !== 'undefined') {
            t.email = teacher.email;
        }
        Teacher.findOneAndUpdate({
            'id': teacher.id
        }, t, function (err, docs) {
            if (!docs) {
                callback('Not found')
            } else {
                callback(err)
            }
        })
    },

    /* 更新教师密码 */
    /* 参数：teacher，callback(err) */
    /* @teacher-待更新教师，@err-将要返回的错误 */
    updateTeacherPassword: function (teacher, callback) {
        var key = {
            key: md5.md5(new Date()),
            type: "teacher"
        };
        var t = {
            password: md5.md5(teacher.password + key.key)
        }
        Teacher.findOneAndUpdate({
            'id': teacher.id
        }, t, function (err, docs) {
            if (err) {
                callback(err);
            } else {
                key.for = docs._id;
                var condition = {
                    'for': key.for,
                    'type': key.type
                };
                var option = {
                    upsert: true
                };
                Key.findOneAndUpdate(condition, key, option, function (err, docs) {
                    callback(err);
                })
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
                var condition = {
                    'for': docs._id,
                    'type': 'teacher',
                };
                Key.findOne(condition, function (err, _docs) {
                    if (err || !_docs) {
                        callback(false);
                    } else {
                        if (md5.md5(teacher.password + _docs.key) === docs.password) {
                            callback(true, docs);
                        } else {
                            callback(false);
                        }
                    }
                })
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
        }, function (err, docs) {
            callback(err)
        });
    },

    /* 验证管理员密码 */
    /* 参数：password，callback(match) */
    /* @password-执行验证的密码，@match-验证结果 */
    checkAdminPassword: function (password, callback) {
        Admin.findOne({}, function (err, docs) {
            if (err || !docs) {
                callback(false);
            } else {
                var condition = {
                    'for': docs._id,
                    'type': 'admin',
                };
                Key.findOne(condition, function (err, _docs) {
                    if (err || !_docs) {
                        callback(false);
                    } else {
                        if (md5.md5(password + _docs.key) === docs.password) {
                            callback(true);
                        } else {
                            callback(false);
                        }
                    }
                })
            }
        });
    },

    /* 更新管理员密码 */
    /* 参数：admin，callback(err) */
    /* @password-新密码，@err-将要返回的错误 */
    updateAdmin: function (password, callback) {
        var key = {
            key: md5.md5(new Date()),
            type: "admin"
        };
        var admin = {
            password: md5.md5(password + key.key)
        }
        Admin.findOneAndUpdate({}, admin, function (err, docs) {
            if (err) {
                callback(err);
            } else {
                key.for = docs._id;
                var condition = {
                    'for': key.for,
                    'type': key.type
                };
                var option = {
                    upsert: true
                };
                Key.findOneAndUpdate(condition, key, option, function (err, docs) {
                    callback(err);
                })
            }
        })
    }
}

module.exports.Dao = Dao;