import React, { useEffect } from 'react';
import './Home.css';

const ContactMe = () => {
  useEffect(() => {
    document.title = 'Contact Me';
  }, []);

  return (
    <div className="body">
        <p>Email: ksypek01@gmail.com</p>
      <p>
          <a href="https://github.com/SypekKonrad" target="_blank" rel="noopener noreferrer" className="github-link">GitHub</a>
      </p>

    </div>
  );
};

export default ContactMe;