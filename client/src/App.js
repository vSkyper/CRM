import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/users').then((res) => {
      setUsers(res.data);
    });
  }, []);

  return (
    <>
      {users.map((user) => (
        <div key={user.id}>
          <div>{user.id}</div>
          <div>{user.name}</div>
          <div>{user.surname}</div>
        </div>
      ))}
    </>
  );
};

export default App;
