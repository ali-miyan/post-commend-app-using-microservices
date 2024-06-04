import express from 'express'
import { randomBytes } from 'crypto'
import cors from 'cors'
import axios from 'axios'

interface Comment {
    id: string;
    content: string;
    status: 'pending' | 'approved' | 'rejected';
}

const app = express();

const commentsByPostId: { [postId: string]: Comment[] } = {};

app.use(express.json())

app.use(cors())

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || [])
})

app.post('/events', async (req, res) => {
    console.log(req.body.type, 'gottit');

    const { type, data } = req.body;

    if (type === 'CommentModerated') {
        const { postId, id, status, content } = data;
        const comments = commentsByPostId[postId];

        const comment: any = comments.find(com => {
            return com.id === id
        })

        comment.status = status;

        try {

            await axios.post('http://localhost:4005/events', {
                type: 'CommentUpdated',
                data: {
                    id,
                    status,
                    content,
                    postId
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    res.send({})
})


app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex')
    const { content } = req.body

    const comments = commentsByPostId[req.params.id] || []

    comments.push({ id: commentId, content, status: 'pending' })

    commentsByPostId[req.params.id] = comments

    try {

        await axios.post('http://localhost:4005/events', {
            type: 'CommentCreated',
            data: {
                id: commentId,
                content,
                postId: req.params.id,
                status: 'pending'
            }
        })
    } catch (error) {
        console.log(error);
    }


    res.status(200).send(comments)
})



app.listen(4001, () => {
    console.log('4001 running');

}) 