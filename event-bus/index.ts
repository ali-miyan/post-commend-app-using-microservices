import express from 'express'
import { randomBytes } from 'crypto'
import cors from 'cors'
import axios from 'axios'

const app = express()
app.use(express.json())
app.use(cors())


app.post('/events', async (req, res) => {

    const event = req.body
    try {
        await axios.post('http://localhost:4000/events', event)
        await axios.post('http://localhost:4001/events', event)
        await axios.post('http://localhost:4002/events', event)
        await axios.post('http://localhost:4003/events', event)
    } catch (error) {
        console.log(error);
    }

    res.send({ status: 'ok' })
})


app.listen(4005, () => {
    console.log('4005 running');

}) 