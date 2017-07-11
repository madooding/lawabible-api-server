import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import compression from 'compression'
import morgan from 'morgan'
import cors from 'cors'
import fs from 'fs'
import mime from 'mime'
import exception from './exception'
import { Chapters } from './models'

const hostname = 'mongodb://database/lawabible'
// mongoose.connect(hostname)


const app = express()
const router = express.Router()
const port = 9000;

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression())
app.use(morgan('combined'))

app.use((req, res, next)=>{
    if(req._parsedUrl.path.split('/')[1] == 'api' && req._parsedUrl.path.split('/').length > 2)
        mongoose.connect(hostname)
    next()
})

app.use(express.static(__dirname + '/static'))


// router.get('/', function(req, res, next){
//     res.sendfile(__dirname + '/static/index.html')
//     next()
// })


router.get('/api/book/:bookid/:chapterid', function (req, res, next){
    Chapters.find({"bookId": req.params.bookid, "chapter": req.params.chapterid}, (err, chapter) => {
        if(chapter.length == 0){
            res.status(404).json(exception.NotFound)
        }else{
            res.json(chapter[0])
        }
    })
})

router.get('/api/books', function(req, res, next){
    Chapters.aggregate([
        {
            $sort: {
                "bookId": 1,
                "chapter": 1
            }
        },
        { 
            $group: {
                _id: '$bookId',
                bookName: { '$first': '$bookName' },
                bookNameTH: { '$first': '$bookNameTH' },
                bookNameLW: { '$first': '$bookNameLW' },
                chapters: { $sum: 1 },
                firstChapter: { '$first': '$chapter' }
            }
        }
    ])
    
    .sort({ _id: 1 })
    .exec((err, books) => {
        res.json(books)
    })
})

router.get(/index.html$/, function(req, res, next) {
    res.sendFile(__dirname + '/static/index.html')
})

router.get(/static/, function(req, res, next){
    let pathname = req._parsedUrl.pathname
    let localPath = __dirname + '/static' +  pathname.substring(pathname.search('/static'))
    fs.readFile(localPath, (err, data) => {
        if(err) res.status(404).json({
            error: {
                messages: 'File not found!'
            }
        }) 
        else {
            let type = mime.lookup(localPath)
            res.setHeader('Content-Type', type)
            res.sendFile(localPath)
        }
    })
})

router.get(/service-worker.js$/, function(req, res, next) {
    res.sendFile(__dirname+'/static/service-worker.js')
    res.setHeader('Content-Type', 'application/javascript')
})

app.use('/', router)


app.use((req, res, next) => {
    mongoose.disconnect()
})

app.listen(port, function(){
    console.log(`Starting Lawa Bible API Service on port ${port}`)
})

