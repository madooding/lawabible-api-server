'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mime = require('mime');

var _mime2 = _interopRequireDefault(_mime);

var _exception = require('./exception');

var _exception2 = _interopRequireDefault(_exception);

var _models = require('./models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hostname = 'mongodb://database/lawabible';
// mongoose.connect(hostname)


var app = (0, _express2.default)();
var router = _express2.default.Router();
var port = 9000;

app.use((0, _cors2.default)());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());
app.use((0, _compression2.default)());
app.use((0, _morgan2.default)('combined'));

app.use(function (req, res, next) {
    if (req._parsedUrl.path.split('/')[1] == 'api' && req._parsedUrl.path.split('/').length > 2) _mongoose2.default.connect(hostname);
    next();
});

app.use(_express2.default.static(__dirname + '/static'));

// router.get('/', function(req, res, next){
//     res.sendfile(__dirname + '/static/index.html')
//     next()
// })


router.get('/api/book/:bookid/:chapterid', function (req, res, next) {
    _models.Chapters.find({ "bookId": req.params.bookid, "chapter": req.params.chapterid }, function (err, chapter) {
        if (chapter.length == 0) {
            res.status(404).json(_exception2.default.NotFound);
        } else {
            res.json(chapter[0]);
        }
    });
});

router.get('/api/books', function (req, res, next) {
    _models.Chapters.aggregate([{
        $sort: {
            "bookId": 1,
            "chapter": 1
        }
    }, {
        $group: {
            _id: '$bookId',
            bookName: { '$first': '$bookName' },
            bookNameTH: { '$first': '$bookNameTH' },
            bookNameLW: { '$first': '$bookNameLW' },
            chapters: { $sum: 1 },
            firstChapter: { '$first': '$chapter' }
        }
    }]).sort({ _id: 1 }).exec(function (err, books) {
        res.json(books);
    });
});

router.get(/index.html$/, function (req, res, next) {
    res.sendFile(__dirname + '/static/index.html');
});

router.get(/static/, function (req, res, next) {
    var pathname = req._parsedUrl.pathname;
    var localPath = __dirname + '/static' + pathname.substring(pathname.search('/static'));
    _fs2.default.readFile(localPath, function (err, data) {
        if (err) res.status(404).json({
            error: {
                messages: 'File not found!'
            }
        });else {
            var type = _mime2.default.lookup(localPath);
            res.setHeader('Content-Type', type);
            res.sendFile(localPath);
        }
    });
});

router.get(/service-worker.js$/, function (req, res, next) {
    res.sendFile(__dirname + '/static/service-worker.js');
    res.setHeader('Service-Worker-Allowed', '/');
    res.setHeader('Content-Type', 'text/sw+javascript');
});

router.get('*', function (req, res, next) {
    res.sendFile(__dirname + '/static/index.html');
});

app.use('/', router);

app.use(function (req, res, next) {
    _mongoose2.default.disconnect();
});

app.listen(port, function () {
    console.log('Starting Lawa Bible API Service on port ' + port);
});