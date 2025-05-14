import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';

const Home = ({ user }) => {
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert('Błąd logowania: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Witaj w GraveMap</h1>
      {user ? (
        <p>Wybierz opcję z menu powyżej.</p>
      ) : (
        <div>
          <p>Zaloguj się, żeby kontynuować</p>
          <button onClick={handleGoogleLogin}>Zaloguj przez Google</button>
        </div>
      )}
    </div>
  );
};

export default Home;
