import axios from 'axios';
import React, { useState } from 'react';


interface PostsProps {
    onPostAdded: () => void;
  }

const Posts: React.FC<PostsProps> = ({ onPostAdded }) => {
  const [title, setPostContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async(event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setError('Post content cannot be empty');
      return;
    }

    await axios.post('http://localhost:4000/posts/create',{
        title
    })

    setPostContent('');
    setError(null); 
    onPostAdded();
  };

  return (
    <div className="max-w-md ml-10  mt-10">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Post Content
          </label>
          <textarea
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              error ? 'border-red-500' : ''
            }`}
            id="title"
            placeholder="What's on your mind?"
            value={title}
            onChange={(e) => {
              setPostContent(e.target.value);
              setError(null);
            }}
          />
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default Posts;
