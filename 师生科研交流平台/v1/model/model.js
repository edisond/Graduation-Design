var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Teacher = new Schema({
    id: String,
    password: String,
    name: String,
    department: String,
    title: String,
    email: String
});

var Student = new Schema({
    id: String,
    password: String,
    name: String,
    major: String,
    grade: String,
    type: String,
    email: String,
    active: Boolean
});

var Admin = new Schema({
    password: String
});

module.exports.Teacher = mongoose.model('teacher', Teacher);
module.exports.Student = mongoose.model('student', Student);
module.exports.Admin = mongoose.model('admin', Admin);