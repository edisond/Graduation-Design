var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* 教师表 */
var Teacher = new Schema({
    /* 工号 */
    id: String,
    /* 密码 */
    password: String,
    /* 密钥 */
    key: String,
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
    /* 密钥 */
    key: String,
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
    /* 密码 */
    password: String,
    /* 密钥 */
    key: String
});

/* 开放实验项目表 */
var OpenExperiment = new Schema({
    /* 项目名 */
    name: String,
    /* 描述 */
    detail: String,
    /* 学生容量 */
    capacity: Number,
    /* 需要学时 */
    effort: Number,
    /* 开始时间 */
    dateStart: Date,
    /* 结束时间 */
    dateEnd: Date,
    /* 状态 */
    status: String,
    /* 需求 */
    requirement: String,
    /* 学院 */
    college: String,
    /* 实验室 */
    lab: String,
    /* 来源 */
    source: String,
    /* 结题形式 */
    result: String,
    /* 对象 */
    object: String,
    /* 教师id */
    teacher: String,
    /* 选课学生id */
    select: Array,
    /* 最后更新日期 */
    updateDate: Date
});


module.exports.Teacher = mongoose.model('teacher', Teacher);
module.exports.Student = mongoose.model('student', Student);
module.exports.Admin = mongoose.model('admin', Admin);
module.exports.OpenExperiment = mongoose.model('openExperiment', OpenExperiment);