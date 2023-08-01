import cn from 'classnames';
import React, { useState } from 'react';
import { User } from '../types/User';

interface Props{
  users: User[],
  handleSelect: (user: User) => void,
  selectedUser: User | null,
}

export const UserSelector: React.FC<Props> = ({
  users, handleSelect, selectedUser,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleClickOnUser = (activeUser: User) => {
    handleSelect(activeUser);
    setShowDropdown(false);
  };

  return (
    <div
      data-cy="UserSelector"
      className={cn('dropdown', { 'is-active': showDropdown })}
    >
      <div className="dropdown-trigger">
        <button
          type="button"
          className="button active"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {!selectedUser
            ? (
              <span>Choose a user</span>
            ) : (
              <span>{selectedUser.name}</span>
            )}

          <span className="icon is-small">
            <i className="fas fa-angle-down" aria-hidden="true" />
          </span>
        </button>
      </div>

      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {users.map((user : User) => (
            <a
              key={user.id}
              href={`#user-${user.id}`}
              className={cn('dropdown-item',
                { 'is-active': selectedUser?.id === user.id })}
              onClick={() => handleClickOnUser(user)}
            >
              {user.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
