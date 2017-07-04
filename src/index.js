import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import compression from 'compression'
import morgan from 'morgan'
import cors from 'cors'
import exception from './exception'
import { Chapters } from './models'

const hostname = 'mongodb://localhost/lawabible'
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

