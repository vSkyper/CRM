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

const App = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [birthdate, setBirthdate] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:3001/users')
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const submitForm = () => {
    const data = { name: name, surname: surname, dateOfBirth: birthdate };

    axios.post('http://localhost:3001/createUser', data).then(() => {
      setName('');
      setSurname('');
      setBirthdate('');
      axios
        .get('http://localhost:3001/users')
        .then((res) => {
          setUsers(res.data);
          console.log(res.data);
        })
        .catch((error) => console.log(error));
    });
  };

  return (
    <Container maxWidth='lg'>
      <CssBaseline />
      <Grid container spacing={5} sx={{ mt: 4 }}>
        <Grid item xs={4}>
          <TextField
            label='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label='Surname'
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label='Birthdate'
            value={birthdate}
            type='date'
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setBirthdate(e.target.value)}
          />
        </Grid>
      </Grid>
      <Button variant='contained' sx={{ mt: 2 }} onClick={submitForm}>
        Submit
      </Button>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Surname</TableCell>
              <TableCell>Birthdate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.surname}</TableCell>
                <TableCell>{user.dateOfBirth}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default App;
