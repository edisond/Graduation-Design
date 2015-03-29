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
        enum: ['老师', '同学']
    },
    /* 是否激活 */
    active: {
        type: 'Boolean',
        required: true,
        default: false
    },
    /* 头像 */
    img: String,
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

/* 项目表 */
var Project = new Schema({
    /* 项目名 */
    name: {
        type: 'String',
        required: true
    },
    /* 项目种类 */
    type: {
        type: 'String',
        required: true,
        enum: ['开放实验项目', '挑战杯项目', '科技创新工程项目']
    },
    /* 简短描述 */
    description: {
        type: 'String',
        required: true
    },
    /* 学院 */
    college: {
        type: 'String',
        required: true
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
    /* 最后更新日期 */
    dateUpdate: {
        type: 'Date',
        required: true,
        default: Date.now()
    },
    /* 状态 */
    active: {
        type: 'Boolean',
        required: true,
        default: true
    },
    /* 教师id */
    teacher: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    /* 开放实验属性 */
    openExperimentAttr: {
        /* 详细 */
        detail: String,
        /* 学生容量 */
        capacity: {
            type: 'Number',
            min: 1
        },
        /* 需要学时 */
        effort: {
            type: 'Number',
            min: 1
        },
        /* 需求 */
        requirement: String,
        /* 实验室 */
        lab: String,
        /* 来源 */
        source: String,
        /* 结题形式 */
        result: String,
        /* 对象 */
        object: String
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
    /* 项目 */
    project: {
        type: Schema.Types.ObjectId,
        ref: 'project'
    },
    /* 日期 */
    date: {
        type: 'Date',
        required: true,
        default: Date.now()
    }
});

var Team = new Schema({
    name: {
        type: 'String',
        required: true
    },
    leader: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    member: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    desc: {
        type: 'String',
        required: true
    },
    dateCreate: {
        type: 'Date',
        required: true,
        default: Date.now()
    }
})

var Select = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: 'team'
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'project'
    },
    active: {
        type: 'Boolean',
        required: true,
        default: false
    },
    date: {
        type: 'Date',
        required: true,
        default: Date.now()
    }
});

module.exports.User = mongoose.model('user', User);
module.exports.Admin = mongoose.model('admin', Admin);
module.exports.Project = mongoose.model('project', Project);
module.exports.Comment = mongoose.model('comment', Comment);
module.exports.Select = mongoose.model('select', Select);
module.exports.Team = mongoose.model('team', Team);