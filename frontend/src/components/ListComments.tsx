import React from "react";

interface Comment {
  id: string;
  content: string;
  status: string;
}

interface CommentListProps {
  comments: Comment[];
}

const ListComment: React.FC<CommentListProps> = ({ comments }) => {
  return (
    <div className="mt-2 border p-5">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>
      {comments.length === 0 ? (
        <p>No comments available</p>
      ) : (
        comments.map((comment, index) => (
          <p key={comment.id} className={`text-gray-600 ${getStatusColor(comment.status)}`}>
            {index + 1}. {comment.content} ({comment.status})
          </p>
        ))
      )}
    </div>
  );
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case "approved":
      return "text-green-500"; 
    case "rejected":
      return "text-red-500"; 
    case "pending":
      return "text-yellow-500"; 
    default:
      return "";
  }
};

export default ListComment;
