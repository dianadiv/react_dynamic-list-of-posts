import React, { useEffect, useState } from 'react';
import 'bulma/bulma.sass';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';
import cn from 'classnames';
import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import { UserSelector } from './components/UserSelector';
import { Loader } from './components/Loader';
import { User } from './types/User';
import { Post } from './types/Post';
import { client } from './utils/fetchClient';

export const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | []>([]);
  const [users, setUsers] = useState<User [] | []>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const handleChooseUser = (currPost: Post) => {
    if (currPost.id === selectedPost?.id) {
      setSelectedPost(null);
      setShowSidebar(false);
    } else {
      setSelectedPost(currPost);
      setShowSidebar(true);
    }

    setShowCommentForm(false);
  };

  useEffect(() => {
    if (!selectedUser) {
      return undefined;
    }

    let ignore = false;

    setLoading(true);
    client.get<Post []>(`/posts?userId=${selectedUser?.id}`)
      .then(result => {
        if (!ignore) {
          setPosts(result);
        }
      })
      .catch(() => setError('Can not upload post'))
      .finally(() => setLoading(false));

    return () => {
      ignore = true;
    };
  }, [selectedUser]);

  useEffect(() => {
    client.get<User []>('/users')
      .then(setUsers);
  }, []);

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector
                  users={users}
                  handleSelect={(user) => {
                    setSelectedUser(user);
                    setShowSidebar(false);
                    setSelectedPost(null);
                  }}
                  selectedUser={selectedUser}
                />
              </div>

              <div className="block" data-cy="MainContent">
                {!selectedUser && (
                  <p data-cy="NoSelectedUser">
                    No user selected
                  </p>
                )}

                {loading && <Loader />}

                {error.length > 0 && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    Something went wrong!
                  </div>
                )}

                {(selectedUser && posts.length === 0
                  && error.length === 0 && !loading) && (
                  <div
                    className="notification is-warning"
                    data-cy="NoPostsYet"
                  >
                    No posts yet
                  </div>
                )}

                {posts.length > 0 && !loading && (
                  <PostsList
                    posts={posts}
                    handleClick={handleChooseUser}
                    showSidebar={selectedPost}
                  />
                )}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={cn(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              { 'Sidebar--open': showSidebar },
            )}
          >
            <div className="tile is-child box is-success ">
              <PostDetails
                post={selectedPost}
                showCommentForm={showCommentForm}
                setVisibleFrom={() => setShowCommentForm(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
