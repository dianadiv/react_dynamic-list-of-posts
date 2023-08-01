import React, { useEffect, useState } from 'react';
import { Loader } from './Loader';
import { Post } from '../types/Post';
import { client } from '../utils/fetchClient';
import { Comment } from '../types/Comment';
import { NewCommentForm } from './NewCommentForm';

interface Props{
  post: Post | null,
  showCommentForm: boolean,
  setVisibleFrom: () => void,
}

export const PostDetails: React.FC<Props> = ({
  post, showCommentForm, setVisibleFrom,
}) => {
  const [comments, setComments] = useState<Comment[] | []>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addComment = (comment: Comment) => {
    setComments(allComments => [...allComments, comment]);
  };

  useEffect(() => {
    if (!post) {
      return undefined;
    }

    setError('');
    let ignore = false;

    setLoading(true);
    client.get<Comment[]>(`/comments?postId=${post?.id}`)
      .then(result => {
        if (!ignore) {
          setComments(result);
        }
      })
      .catch(() => setError('Can not upload comments'))
      .finally(() => setLoading(false));

    return () => {
      ignore = true;
    };
  }, [post]);

  return (
    <div className="content" data-cy="PostDetails">
      <div className="content" data-cy="PostDetails">
        <div className="block">
          <h2 data-cy="PostTitle">
            {`#${post?.id}: ${post?.title}`}
          </h2>

          <p data-cy="PostBody">
            {post?.body}
          </p>
        </div>

        <div className="block">
          {loading && <Loader />}

          {error.length > 0 && (
            <div className="notification is-danger" data-cy="CommentsError">
              Something went wrong!
            </div>
          )}

          {(error.length === 0 && comments.length === 0 && !loading) && (
            <p className="title is-4" data-cy="NoCommentsMessage">
              No comments yet
            </p>
          )}

          {comments.length > 0 && !loading && error.length === 0 && (
            <>
              <p className="title is-4">Comments:</p>
              {comments.map(comment => (
                <article
                  className="message is-small"
                  data-cy="Comment"
                  key={comment.id}
                >
                  <div className="message-header">
                    <a href={`mailto:${comment.name}`} data-cy="CommentAuthor">
                      {comment.name}
                    </a>
                    <button
                      data-cy="CommentDelete"
                      type="button"
                      className="delete is-small"
                      aria-label="delete"
                    >
                      delete button
                    </button>
                  </div>

                  <div className="message-body" data-cy="CommentBody">
                    {comment.body}
                  </div>
                </article>
              ))}
            </>
          )}

          {!loading && error.length === 0 && !showCommentForm && (
            <button
              data-cy="WriteCommentButton"
              type="button"
              className="button is-link"
              onClick={() => setVisibleFrom()}
            >
              Write a comment
            </button>
          )}
        </div>

        {showCommentForm && error.length === 0 && (
          <NewCommentForm
            post={post}
            handleAddComment={addComment}
            setError={(errorTitle) => setError(errorTitle)}
          />
        )}
      </div>
    </div>
  );
};
