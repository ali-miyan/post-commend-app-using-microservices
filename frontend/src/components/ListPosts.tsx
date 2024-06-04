import React, { useState, useEffect } from "react";
import axios from "axios";
import ListComment from "./ListComments";

interface Comment {
  id: string;
  content: string;
  status:string;
}

interface Post {
  id: string;
  title: string;
  comments: Comment[];
}

interface ListPostProps {
  refreshList: boolean;
  setRefreshList: React.Dispatch<React.SetStateAction<boolean>>;
}

const ListPost: React.FC<ListPostProps> = ({ refreshList, setRefreshList }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<{ [postId: string]: string }>({});

  const fetchPosts = async () => {
    try {
      const response = await axios.get<{ [key: string]: Post }>(
        "http://localhost:4002/posts"
      );

      const postsArray = Object.keys(response.data).map((key) => ({
        id: key,
        title: response.data[key].title,
        comments: response.data[key].comments
      }));

      setPosts(postsArray);
      setLoading(false);
      setRefreshList(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };
  console.log(refreshList,'ddddddddddddddddddddddddddddddddddddddddddddddddddddddddd');
  

  useEffect(() => {
    fetchPosts();
  }, [refreshList]);

  const handleAddComment = async (postId: string) => {
    const newComment = comments[postId]?.trim() || '';
    if (newComment === "") return;

    try {
      const res = await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
        content: newComment,
      });
      console.log(res);

      setRefreshList(true);
      setComments({ ...comments, [postId]: '' });
      
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleCommentChange = (postId: string, value: string) => {
    setComments({ ...comments, [postId]: value });
  };

  return (
    <div className="max-w-full ml-10 mt-10 flex flex-wrap">
      <h2 className="text-2xl font-bold mb-4 w-full">Post List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        posts.map((post, ind) => (
          <div
            key={post.id}
            className="bg-white shadow-md rounded px-6 py-4 mb-4 mr-4"
            style={{ minWidth: "200px" }}
          >
            <p className="text-gray-700 mb-2">
              {ind + 1}. {post.title}
            </p>
            <div className="flex items-center">
              <input
                type="text"
                className="border border-gray-300 rounded py-1 px-2 mr-2"
                placeholder="Add comment..."
                value={comments[post.id] || ''}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
              />
              <button
                className="bg-blue-500 text-white py-1 px-4 rounded"
                onClick={() => handleAddComment(post.id)}
              >
                Add
              </button>
            </div>
              <ListComment comments={post.comments} />
          </div>
        ))
      )}
      {posts.length === 0 && <p>No posts available</p>}
    </div>
  );
};

export default ListPost;
