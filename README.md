# lawabible-api-server
> RESTful API Service for lawabible project

## Build Setup

``` bash
# install dependencies
npm install

# serve with nodemon at localhost:8080
npm start

```

## API Usage

> GET /book/:book-id/:chapter-id

1. **:book-id** is mean a ordinal number of books in the bible. for example, the id of genesis will be 1, Matthew will be 40 by order.
2. **:chapter-id** is a chapter number.

``` bash
Response
{
    _id: "5925cfe53f69a3073ff69020",
    chapter: 18,
    bookName: "MAT",
    bookId: 40,
    content: [
        {
            type: "sub-header",
            content: "ป ระ ฮา ปุย นึง บั่นเมือง มะลอง"
        },
        {
            type: "verse",
            verse: 1,
            content: "1 เญือม เซ เยอ, โม ลุกซิก อื ฮอยจ เคะ พะเยซู. ไฮมญ อื ตอก เฮี, มัฮ ปุย ป ระ ไล ฮา ปุย นึง บั่นเมือง มะลอง เงอ? อัฮ เซ ละ อื."
        },
        {
            type: "verse",
            verse: 2,
            content: "2 พะเยซู กอก กวนดุ เอีญ เคะ แตะ ติ ปุย. เกือฮ อื ชุง อักอวน โม เซ."
        },
        ...
    ]
}

```
