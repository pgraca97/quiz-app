import React from 'react';
import { Link } from 'react-router';

const Header = () => {
  return (
    <header>
      <h1>Which Element Are You?</h1>
      <p>(based on completely random things)</p>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/quiz">Quiz</Link>
      </nav>
    </header>
  );
};

export default Header;