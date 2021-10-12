import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CssBaseline,
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

const App = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    getUsers(setUsers);
  }, []);

  const submitForm = () => {
    const data = { name, surname, dateOfBirth, login, password };

    axios
      .post('http://localhost:3001/createUser', data)
      .then(() => {
        setName('');
        setSurname('');
        setDateOfBirth('');
        setLogin('');
        setPassword('');
        getUsers(setUsers);
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
    <Container maxWidth='lg'>
      <CssBaseline />
      <Grid
        container
        justifyContent='flex-start'
        alignItems='center'
        spacing={3}
        sx={{ mt: 4 }}
      >
        <Grid item xs={3}>
          <TextField
            label='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label='Surname'
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label='Birthdate'
            value={dateOfBirth}
            type='date'
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label='Login'
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label='Password'
            value={password}
            type='password'
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant='contained' onClick={submitForm}>
            Submit
          </Button>
        </Grid>
      </Grid>
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
                  <Button
                    variant='outlined'
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
    </Container>
  );
};

export default App;
