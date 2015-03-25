var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* 教师表 */
var User = new Schema({
    /* 学号或工号 */
    id: {
        type: 'String',
        required: true,
        unique: true
    },
    /* 密码 */
    password: {
        type: 'String',
        required: true
    },
    /* 密钥 */
    key: {
        type: 'String',
        required: true
    },
    /* 姓名 */
    name: {
        type: 'String',
        required: true
    },
    /* 性别 */
    sex: {
        type: 'String',
        enum: ['男', '女', '其它']
    },
    /* 用户种类 */
    type: {
        type: 'String',
        required: true,
        enum: ['student', 'teacher']
    },
    active: {
        type: 'Boolean',
        required: true,
        default: false
    },
    /* 邮箱 */
    email: String,
    /* 联系电话 */
    phone: String,
    /* 学生属性 */
    studentAttr: {
        /* 学院 */
        college: String,
        /* 专业 */
        major: String,
        /* 年级 */
        grade: String,
        /* 类型（本科，研究生等） */
        studentType: String,
        /* 宿舍地址 */
        address: String
    },
    /* 教师属性 */
    teacherAttr: {
        /* 部门 */
        department: String,
        /* 职称 */
        title: String
    }
});

/* 管理员表 */
var Admin = new Schema({
    /* 密码 */
    password: {
        type: 'String',
        required: true
    },
    /* 密钥 */
    key: {
        type: 'String',
        required: true
    }
});

/* 开放实验项目表 */
var OpenExperiment = new Schema({
    /* 项目名 */
    name: {
        type: 'String',
        required: true
    },
    /* 描述 */
    detail: {
        type: 'String',
        required: true
    },
    /* 学生容量 */
    capacity: {
        type: 'Number',
        required: true,
        min: 1
    },
    /* 需要学时 */
    effort: {
        type: 'Number',
        required: true,
        min: 1
    },
    /* 开始时间 */
    dateStart: {
        type: 'Date',
        required: true
    },
    /* 结束时间 */
    dateEnd: {
        type: 'Date',
        required: true
    },
    /* 状态 */
    active: {
        type: 'Boolean',
        required: true,
        default: true
    },
    /* 需求 */
    requirement: {
        type: 'String',
        required: true
    },
    /* 学院 */
    college: {
        type: 'String',
        required: true
    },
    /* 实验室 */
    lab: {
        type: 'String',
        required: true
    },
    /* 来源 */
    source: {
        type: 'String',
        required: true
    },
    /* 结题形式 */
    result: {
        type: 'String',
        required: true
    },
    /* 对象 */
    object: {
        type: 'String',
        required: true
    },
    /* 教师id */
    teacher: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    /* 选课学生id */
    select: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    /* 申请学生id */
    apply: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    /* 最后更新日期 */
    dateUpdate: {
        type: 'Date',
        required: true,
        default: Date.now()
    }
});

/* 讨论表 */
var Comment = new Schema({
    /* 来自 */
    from: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    /* 回复 */
    to: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    /* 内容 */
    body: {
        type: 'String',
        required: true,
    },
    /* 开放实验 */
    openExperiment: {
        type: Schema.Types.ObjectId,
        ref: 'openExperiment'
    },
    /* 日期 */
    date: {
        type: 'Date',
        required: true,
        default: Date.now()
    }

});

module.exports.User = mongoose.model('user', User);
module.exports.Admin = mongoose.model('admin', Admin);
module.exports.OpenExperiment = mongoose.model('openExperiment', OpenExperiment);
module.exports.Comment = mongoose.model('comment', Comment);