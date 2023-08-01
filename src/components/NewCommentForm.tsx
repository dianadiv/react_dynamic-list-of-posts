import React, { useState } from 'react';
import cn from 'classnames';
import { client } from '../utils/fetchClient';
import { Post } from '../types/Post';
import { Comment } from '../types/Comment';

interface Props{
  post: Post | null,
  handleAddComment: (comment: Comment) => void,
  setError: (error: string) => void,
}

export const NewCommentForm: React.FC<Props> = ({
  post, handleAddComment, setError,
}) => {
  const [nameValue, setNameValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [textValue, setTextValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasNameError, setHasNameError] = useState(false);
  const [hasEmailError, setHasEmailError] = useState(false);
  const [hasTextError, setHasTextError] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setHasNameError(!nameValue);
    setHasEmailError(!emailValue);
    setHasTextError(!textValue);

    if (!nameValue || !emailValue || !textValue) {
      return;
    }

    const data = {
      postId: post ? post.id : 0,
      name: nameValue,
      email: emailValue,
      body: textValue,
    };

    setLoading(true);

    client.post<Comment>('/comments', data)
      .then(response => {
        setTextValue('');
        handleAddComment(response);

        return response;
      })
      .catch(() => setError('Can not add a comment'))
      .finally(() => setLoading(false));
  };

  const handleChangeName = (newValue: string) => {
    setNameValue(newValue);
    setHasNameError(false);
  };

  const handleChangeEmail = (newValue: string) => {
    setEmailValue(newValue);
    setHasEmailError(false);
  };

  const handleChangeText = (newValue: string) => {
    setTextValue(newValue);
    setHasTextError(false);
  };

  const handleClear = () => {
    setNameValue('');
    setEmailValue('');
    setTextValue('');
    setHasNameError(false);
    setHasEmailError(false);
    setHasTextError(false);
  };

  return (
    <form data-cy="NewCommentForm" onSubmit={event => handleSubmit(event)}>
      <div className="field" data-cy="NameField">
        <label className="label" htmlFor="comment-author-name">
          Author Name
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="name"
            id="comment-author-name"
            placeholder="Name Surname"
            className={cn('input', { 'is-danger': hasNameError })}
            value={nameValue}
            onChange={event => handleChangeName(event.target.value)}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-user" />
          </span>

          {hasNameError && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {hasNameError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Name is required
          </p>
        )}
      </div>

      <div className="field" data-cy="EmailField">
        <label className="label" htmlFor="comment-author-email">
          Author Email
        </label>

        <div className="control has-icons-left has-icons-right">
          <input
            type="text"
            name="email"
            id="comment-author-email"
            placeholder="email@test.com"
            className={cn('input', { 'is-danger': hasEmailError })}
            value={emailValue}
            onChange={event => handleChangeEmail(event.target.value)}
          />

          <span className="icon is-small is-left">
            <i className="fas fa-envelope" />
          </span>

          {hasEmailError && (
            <span
              className="icon is-small is-right has-text-danger"
              data-cy="ErrorIcon"
            >
              <i className="fas fa-exclamation-triangle" />
            </span>
          )}
        </div>

        {hasEmailError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Email is required
          </p>
        )}
      </div>

      <div className="field" data-cy="BodyField">
        <label className="label" htmlFor="comment-body">
          Comment Text
        </label>

        <div className="control">
          <textarea
            id="comment-body"
            name="body"
            placeholder="Type comment here"
            className={cn('textarea', { 'is-danger': hasTextError })}
            value={textValue}
            onChange={event => handleChangeText(event.target.value)}
          />
        </div>

        {hasTextError && (
          <p className="help is-danger" data-cy="ErrorMessage">
            Enter some text
          </p>
        )}
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className={cn(
              'button is-link',
              { 'is-loading': loading },
            )}
          >
            Add
          </button>
        </div>

        <div className="control">
          {/* eslint-disable-next-line react/button-has-type */}
          <button
            type="reset"
            className="button is-link is-light"
            onClick={() => handleClear()}
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};
