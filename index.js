import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import exception from './exception'
import Chapters from './model/chapters'

mongoose.connect('mongodb://localhost/lawabible')
const app = express()
const router = express.Router()
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.route('/', function (req, res, next) {
    res.json({
        "messages": "Welcome to Lawa Bible API Service. Please contact m.me/madooding if you want a document of API using."
    })
});

router.get('/book/:bookid/:chapterid', function (req, res, next){
    Chapters.find({"bookId": req.params.bookid, "chapter": req.params.chapterid}, (err, chapter) => {
        if(chapter.length == 0){
            res.json(exception.NotFound)
        }else{
            res.json(chapter[0])
        }
    })
})

app.use('/', router)

app.listen(port, function(){
    console.log(`Starting Lawa Bible API Service on port ${port}`)
})

console.log("hello, world!")
