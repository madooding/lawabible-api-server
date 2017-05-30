import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const chapterSchema = new Schema({
    bookId: Number,
    bookName: String,
    bookNameTH: String,
    bookNameLW: String,
    chapter: Number,
    contents: Array
})

const Chapters = mongoose.model('chapters', chapterSchema)

export default Chapters