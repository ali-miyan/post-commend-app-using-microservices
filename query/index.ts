import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';

interface Post {
  id: string;
  title: string;
  comments: Comment[];
}

interface Comment {
  id: string;
  content: string;
  status: string;
}

interface Event {
  type: string;
  data: any;
}

const app = express();

const posts: { [key: string]: Post } = {};

app.use(express.json());
app.use(cors());

app.get('/posts', (req: Request, res: Response) => {
  res.send(posts);
});

const handleEvent = (type: string, data: any) => {
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }
  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];

    const comment = post.comments.find((com: any) => {
      return com.id === id;
    });

    if (comment) {
      comment.status = status;
      comment.content = content;
    }
  }
};

app.post('/events', (req: Request, res: Response) => {
  const { type, data } = req.body as Event;

  handleEvent(type, data);

  res.send({});
});

app.listen(4002, async () => {
  console.log('4002 running');
});
