import express from 'express'
import axios from 'axios'
const app = express()

app.use(express.json())

app.post('/events', async (req, res) => {

  console.log(req.body);

  const { type, data } = req.body;

  if (type === 'CommentCreated') {

    const status = data.content.includes('siu') ? 'rejected' : 'approved'

    try {

      await axios.post('http://localhost:4005/events', {
        type: 'CommentModerated',
        data: {
          id: data.id,
          postId: data.postId,
          status,
          content: data.content
        }
      })
    } catch (error) {
      console.log(error);
    }
  }


  res.send({})


})


app.listen(4003, () => {
  console.log('4003 running');

})
