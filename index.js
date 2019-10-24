const express = require('express')
const bodyParser = require('body-parser')
const randomstring = require('randomstring')
const reigsterJson = require('./register')

const app = express()
const port = 3000

function findUrl(url){
    let id = "not"
    reigsterJson.map(Data=>{
        if(Data.url == url){
            id = Data.id 
        }
    })
    return id
}
function makeId(findUrl){
    reigsterJson.push({url:findUrl,id:randomstring.generate(7)})
    console.log(reigsterJson)
}

app.post("/register.json",(req,res)=>{
    const id = findUrl(req.query.url)
    if(id == "not"){
        makeId(req.query.url)
    }else{
        res.status(200).contentType('application/json').json({Body: { url: `http://localhost:3000/${id}`} })
    }
})

app.listen(port,()=>console.log("work"))