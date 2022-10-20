const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')
const config = require('./config')


const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

const port = 3001

app.get("/", (req, res) => {
    res.status(200).send('Nothing on this page! Try /tasks')
} )
app.get("/tasks", async function (req, res) {
    try {
        const connection = await mysql.createConnection(config.db)
        const [result,] = await connection.execute('select * from task')

        if (!result) result=[]
        res.status(200).json(result)
    } catch(err) {
        res.status(500).json({error: err.message})
    }
})

app.post("/new", async function(req, res) {
    try {
        const connection = await mysql.createConnection(config.db)
        const [result,] = await connection.execute('insert into task (description) values (?) ', [req.body.description])
        res.status(200).json({id:result.insertId})
    } catch(err) {
        res.status(500).json({error: err.message})
    }
})

app.delete("/delete/:id", async function(req, res) {
    try{
        const connection = await mysql.createConnection(config.db)
        await connection.execute('delete from task where id = ? ',[req.params.id])
        res.status(200).json({id:req.params.id})
    } catch(err){
        res.status(500).json({error: err.message})
    }
})

app.listen(port)