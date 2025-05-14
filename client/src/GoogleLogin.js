import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';

const GoogleLogin = () => {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert('Zalogowano przez Google');
    } catch (error) {
      alert('Błąd logowania: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Logowanie Google</h2>
      <button onClick={handleLogin}>Zaloguj się przez Google</button>
    </div>
  );
};

export default GoogleLogin;
