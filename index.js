const express = require('express')
const bodyParser = require('body-parser')
const randomstring = require('randomstring')
const fs = require('fs')
const moment = require('moment-timezone')
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
    registerJson.push({url:findUrl,id:urlId,stats:[]})
    saveStat(urlId)
    return urlId
}

function saveStat(id){
    const nowDate = moment.tz(new Date(),"Asia/Seoul").format('YYYY-MM-DD HH:00:00')
    const indexNum = findStat(nowDate,id)
    if(indexNum[1] == -1){
        registerJson[indexNum[0]].stats.push({at:nowDate,visit:1})
    }else{
        registerJson[indexNum[0]].stats[indexNum[1]].visit += 1
    }
}

function findIdIndex(id){
    const indexNum = registerJson.findIndex((data,index)=>{
        return data.id == id
    })
    return indexNum
}

function findStat(date,id){
    const indexNum = findIdIndex(id)
    const statsIndexNum = registerJson[indexNum].stats.findIndex((data,index)=>{
        return data.at == date
    })
    return [indexNum,statsIndexNum]
}


app.post("/register.json",(req,res)=>{
    const id = findUrl(req.query.url)
    if(id == "not"){
        res.status(201).contentType('application/json').json({Body:{ url: `http://localhost:3000/${makeId(req.query.url)}`}})
    }else{
        saveStat(id)
        res.status(200).contentType('application/json').json({Body: { url: `http://localhost:3000/${id}`} })
    }
})

app.get("/:id",(req,res)=>{
    const originalUrl = findId(req.params.id)
    res.status(301).contentType('application/json').json({Location:originalUrl})
})
app.get("/:id/stats",(req,res)=>{
    const indexNum = findIdIndex(req.params.id)
    res.status(200).contentType('application/json').json({Body:{"Stats":registerJson[indexNum].stats}})
})

app.listen(port,()=>console.log("work"))