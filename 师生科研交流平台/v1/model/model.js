var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var User = new Schema({
    id: {
        type: 'String',
        required: true,
        unique: true
    },
    password: {
        type: 'String',
        required: true
    },
    key: {
        type: 'String',
        required: true
    },
    name: {
        type: 'String',
        required: true
    },
    sex: {
        type: 'String',
        enum: ['男', '女', '其它']
    },
    type: {
        type: 'String',
        required: true,
        enum: ['老师', '同学', '管理员']
    },
    active: {
        type: 'Boolean',
        required: true,
        default: false
    },
    email: String,
    phone: String,
    studentAttr: {
        college: String,
        major: String,
        grade: String,
        studentType: String,
        address: String
    },
    teacherAttr: {
        department: String,
        title: String
    }
});

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
    /* 教师id */
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    creator: {
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
    },
    challengeCupAttr: {
        ccType: {
            type: 'String',
            enum: ['哲学社会科学类社会调查报告和学术论文', '自然科学类学术论文', '科技发明制作类', '创业计划类']
        },
        ccBasis: String,
        ccGoal: String,
        ccStatus: String,
        ccUsage: String,
        ccCondition: String,
        ccSchedule: String,
        ccTeam: String,
        ccFund: String,
        ccDBasic: String,
        ccDMarket: String,
        ccDManage: String
    },

    innovationProjectAttr: {
        ipDetail: String,
        ipKeywords: String,
        ipBasis: String,
        ipSchedule: String,
        ipCondition: String,
        ipFund: String
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

var TeamApply = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: 'team',
        required: true
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
})

module.exports.User = mongoose.model('user', User);
module.exports.Project = mongoose.model('project', Project);
module.exports.Comment = mongoose.model('comment', Comment);
module.exports.Select = mongoose.model('select', Select);
module.exports.Team = mongoose.model('team', Team);
module.exports.TeamApply = mongoose.model('teamapply', TeamApply);