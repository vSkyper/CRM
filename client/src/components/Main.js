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
  TextField,
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

  const [editID, setEditID] = useState(null);
  const [editLogin, setEditLogin] = useState('');
  const [editName, setEditName] = useState('');
  const [editSurname, setEditSurname] = useState('');
  const [editDateOfBirth, setEditDateOfBirth] = useState('');

  useEffect(() => {
    getUsers(setUsers);
  }, []);

  const setEdit = (user) => {
    setEditID(user.id);
    setEditLogin(user.login);
    setEditName(user.name);
    setEditSurname(user.surname);
    setEditDateOfBirth(user.dateOfBirth);
  };

  const submitEdit = () => {
    const data = {
      id: editID,
      name: editName,
      surname: editSurname,
      dateOfBirth: editDateOfBirth,
      login: editLogin,
    };
    axios
      .put('http://localhost:3001/editUser', data)
      .then(() => {
        getUsers(setUsers);
        setEditID(null);
      })
      .catch((error) => console.log(error));
  };

  const deleteUser = (id) => {
    axios
      .delete('http://localhost:3001/deleteUser', { data: { id } })
      .then(() => {
        getUsers(setUsers);
      })
      .catch((error) => console.log(error));
  };

  return (
    <TableContainer component={Paper} sx={{ my: 4 }}>
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
              {editID === user.id ? (
                <>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <TextField
                      label='Login'
                      value={editLogin}
                      onChange={(e) => setEditLogin(e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      label='Name'
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      label='Surname'
                      value={editSurname}
                      onChange={(e) => setEditSurname(e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      label='dateOfBirth'
                      value={editDateOfBirth}
                      type='date'
                      InputLabelProps={{ shrink: true }}
                      onChange={(e) => setEditDateOfBirth(e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='outlined'
                      color='success'
                      onClick={submitEdit}
                    >
                      Save
                    </Button>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.login}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.surname}</TableCell>
                  <TableCell>{user.dateOfBirth}</TableCell>
                  <TableCell>
                    <Button variant='outlined' onClick={() => setEdit(user)}>
                      Edit
                    </Button>
                  </TableCell>
                </>
              )}
              <TableCell>
                <Button
                  variant='outlined'
                  color='error'
                  onClick={() => deleteUser(user.id)}
                >
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
