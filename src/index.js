import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import exception from './exception'
import { Chapters } from './models'

const hostname = 'mongodb://localhost/lawabible'
// mongoose.connect(hostname)


const app = express()
const router = express.Router()
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next)=>{
    if(req._parsedUrl.path.split('/')[1] == 'api' && req._parsedUrl.path.split('/').length > 2)
        mongoose.connect(hostname)
    next()
})

router.all('/', function (req, res, next) {
    res.json({
        "messages": "Welcome to Lawa Bible API Service. Please contact m.me/madooding if you want a document of API using."
    })
});

router.get('/api/book/:bookid/:chapterid', function (req, res, next){
    Chapters.find({"bookId": req.params.bookid, "chapter": req.params.chapterid}, (err, chapter) => {
        if(chapter.length == 0){
            res.status(404).json(exception.NotFound)
        }else{
            res.json(chapter[0])
        }
        next()
    })
})

router.get('/api/books', function(req, res, next){
    Chapters.aggregate([{$project: {"bookId":"$bookId", "bookName": "$bookName", "bookNameTH": "$bookNameTH", "bookNameLW": "$bookNameLW", "firstChapter":"$chapter"}}, {$group: {_id:"$bookId", "bookName": {"$first": "$bookName"}, "bookNameTH": {"$first": "$bookNameTH"}, "bookNameLW": {"$first": "$bookNameLW"}, chapters: {$sum: 1}, "firstChapter": {"$first": "$$ROOT.firstChapter"}}}, {$sort: { _id: 1}}], (err, result) => {
        if(!err){
            res.json(result)
        }
        next()
    })
})

app.use('/', router)

app.use((req, res, next) => {
    mongoose.disconnect()
})

app.listen(port, function(){
    console.log(`Starting Lawa Bible API Service on port ${port}`)
})

