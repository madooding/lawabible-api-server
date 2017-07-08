'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var chapterSchema = new _mongoose.Schema({
    bookId: Number,
    bookName: String,
    bookNameTH: String,
    bookNameLW: String,
    chapter: Number,
    contents: Array
});

var Chapters = _mongoose2.default.model('chapters', chapterSchema);

exports.default = Chapters;