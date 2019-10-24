const express = require('express')
const bodyParser = require('body-parser')
const randomstring = require('randomstring')
const fs = require('fs')
const registerJson = require('./register.json')

const app = express()
const port = 3000

function findUrl(url){
    let id = "not"
    registerJson.map(Data=>{
        if(Data.url == url){
            id = Data.id 
        }
    })
    return id
}

function findId(id){
    let originUrl = ""
    registerJson.map(Data=>{
        if(Data.id==id){
            originUrl = Data.url
        }
    })
    return originUrl
}

function makeId(findUrl){
    urlId = randomstring.generate(7)
    registerJson.push({url:findUrl,id:urlId})
    // let writeJson = JSON.stringify(registerJson)
    return urlId
}


app.post("/register.json",(req,res)=>{
    const id = findUrl(req.query.url)
    if(id == "not"){
        res.status(201).contentType('application/json').json({Body:{ url: `http://localhost:3000/${makeId(req.query.url)}`}})
    }else{
        res.status(200).contentType('application/json').json({Body: { url: `http://localhost:3000/${id}`} })
    }
})

app.get("/:id",(req,res)=>{
    const originalUrl = findId(req.params.id)
    console.log(originalUrl)
})

app.listen(port,()=>console.log("work"))