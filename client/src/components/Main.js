import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';

const getUsers = (setUsers) => {
  axios
    .get('http://localhost:3001/users')
    .then((res) => {
      setUsers(res.data);
    })
    .catch((error) => console.log(error));
};

const Main = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers(setUsers);
  }, []);

  const deleteUser = (id) => {
    axios
      .delete('http://localhost:3001/deleteUser', { data: { id } })
      .then(() => {
        getUsers(setUsers);
      })
      .catch((error) => console.log(error));
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Login</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Surname</TableCell>
            <TableCell>Birthdate</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.login}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.surname}</TableCell>
              <TableCell>{user.dateOfBirth}</TableCell>
              <TableCell>
                <Button variant='outlined'>Edit</Button>
              </TableCell>
              <TableCell>
                <Button variant='outlined' onClick={() => deleteUser(user.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Main;
