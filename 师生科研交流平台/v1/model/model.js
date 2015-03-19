var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* 密钥表 */
var Key = new Schema({
    /* 密钥 */
    key: String,
    /* 所属用户标志 */
    for: String,
    /* 所属用户类型 （学生，教师或管理员）*/
    type: String
});

/* 教师表 */
var Teacher = new Schema({
    /* 工号 */
    id: String,
    /* 密码 */
    password: String,
    /* 姓名 */
    name: String,
    /* 性别 */
    sex: String,
    /* 所属部门 */
    department: String,
    /* 职称 */
    title: String,
    /* 邮箱 */
    email: String,
    /* 联系电话 */
    phone: String,
    /* 激活 */
    active: Boolean
});

/* 学生表 */
var Student = new Schema({
    /* 学号 */
    id: String,
    /* 密码 */
    password: String,
    /* 姓名 */
    name: String,
    /* 性别 */
    sex: String,
    /* 学院 */
    college: String,
    /* 专业 */
    major: String,
    /* 年级 */
    grade: String,
    /* 类型（本科，研究生等） */
    type: String,
    /* 邮箱 */
    email: String,
    /* 联系电话 */
    phone: String,
    /* 宿舍地址 */
    address: String,
    /* 激活 */
    active: Boolean
});

/* 管理员表 */
var Admin = new Schema({
    password: String
});

module.exports.Key = mongoose.model('key', Key);
module.exports.Teacher = mongoose.model('teacher', Teacher);
module.exports.Student = mongoose.model('student', Student);
module.exports.Admin = mongoose.model('admin', Admin);