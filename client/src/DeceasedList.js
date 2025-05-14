import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const DeceasedList = () => {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'deceased'));
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPeople(list);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Lista zmarłych</h2>
      {people.length === 0 ? (
        <p>Brak danych</p>
      ) : (
        <ul>
          {people.map(person => (
            <li key={person.id}>
              <strong>{person.firstName} {person.lastName}</strong>  
              <br />
              Data ur.: {person.birthDate}, śm.: {person.deathDate}
              <br />
              {person.bio}
              <br />
              Miejsce ur.: {person.birthPlace}, śmierci: {person.deathPlace}
              <br /><br />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeceasedList;
