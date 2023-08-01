import React from 'react';
import cn from 'classnames';
import { Post } from '../types/Post';

interface Props{
  posts: Post[] | null,
  handleClick: (post: Post) => void,
  showSidebar: Post | null,
}

export const PostsList: React.FC<Props> = ({
  posts, handleClick, showSidebar,
}) => {
  return (
    <div data-cy="PostsList">
      <p className="title">Posts:</p>

      <table className="table is-fullwidth is-striped is-hoverable is-narrow">
        <thead>
          <tr className="has-background-link-light">
            <th>#</th>
            <th>Title</th>
            <th> </th>
          </tr>
        </thead>

        <tbody>
          {posts?.map(post => (
            <tr data-cy="Post">
              <td data-cy="PostId">{post.id}</td>

              <td data-cy="PostTitle">
                {post.title}
              </td>

              <td className="has-text-right is-vcentered">
                <button
                  type="button"
                  data-cy="PostButton"
                  className={cn('button', {
                    'is-link': showSidebar?.id === post.id,
                    'is-light': showSidebar?.id !== post.id,
                  })}
                  onClick={() => handleClick(post)}
                >
                  {showSidebar?.id === post.id
                    ? <p>Close</p>
                    : <p>Open</p>}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
