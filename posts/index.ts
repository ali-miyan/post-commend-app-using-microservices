import express, { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import cors from 'cors';
import axios from 'axios';

const app = express();

interface Post {
    id: string;
    title: string;
}

const posts: { [key: string]: Post } = {};

app.use(express.json());
app.use(cors());

app.get('/posts', (req: Request, res: Response) => {
    res.send(posts);
});

app.post('/events', (req: Request, res: Response) => {
    console.log(req.body.type, 'gottit');

    res.send({});
});

app.post('/posts/create', async (req: Request, res: Response) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    console.log(title);

    const newPost: Post = { id, title };

    posts[id] = newPost;

    try {
        await axios.post('http://localhost:4005/events', {
            type: 'PostCreated',
            data: {
                id,
                title
            }
        });
    } catch (error) {
        console.log(error);
    }

    res.status(200).send(newPost);
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

console.log(posts);
