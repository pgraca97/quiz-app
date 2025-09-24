import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from './UserContext';

const UserForm = () => {
  const [inputName, setInputName] = useState('');
  const { setName } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputName.trim()) {
      setName(inputName);
      navigate('/quiz');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">
        Name:
        <input
          id="name"
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder="Enter your name"
          required
        />
      </label>
      <button type="submit">Start Quiz</button>
    </form>
  );
};

export default UserForm;