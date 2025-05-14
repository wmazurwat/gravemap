import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const DeceasedList = () => {
  const [people, setPeople] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'deceased'));
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPeople(list);
    };

    fetchData();
  }, []);

  const filteredPeople = people.filter(person =>
    (
      person.firstName +
      person.lastName +
      person.birthPlace +
      person.deathPlace
    )
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Lista zmarłych</h2>

      <input
        type="text"
        placeholder="Szukaj po imieniu, nazwisku, miejscu..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '15px', padding: '5px', width: '300px' }}
      />

      {filteredPeople.length === 0 ? (
        <p>Brak wyników</p>
      ) : (
        <ul>
          {filteredPeople.map(person => (
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
