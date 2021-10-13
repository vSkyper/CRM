import { useState } from 'react';
import axios from 'axios';
import { TextField, Grid, Paper, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';

const Register = () => {
  const [login, setLogin] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();

  const submitForm = () => {
    const data = { name, surname, dateOfBirth, login, password };

    axios
      .post('http://localhost:3001/createUser', data)
      .then(() => {
        history.push('/');
      })
      .catch((error) => console.log(error));
  };

  return (
    <Grid
      container
      alignItems='center'
      justifyContent='center'
      style={{ minHeight: '100vh' }}
    >
      <Paper sx={{ p: 5 }}>
        <Grid container direction='column' alignItems='center' spacing={4}>
          <Grid item>
            <TextField
              label='Login'
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              sx={{ width: 300 }}
            />
          </Grid>
          <Grid item>
            <TextField
              label='Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ width: 300 }}
            />
          </Grid>
          <Grid item>
            <TextField
              label='Surname'
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              sx={{ width: 300 }}
            />
          </Grid>
          <Grid item>
            <TextField
              label='Birthdate'
              value={dateOfBirth}
              type='date'
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setDateOfBirth(e.target.value)}
              sx={{ width: 300 }}
            />
          </Grid>
          <Grid item>
            <TextField
              label='Password'
              value={password}
              type='password'
              onChange={(e) => setPassword(e.target.value)}
              sx={{ width: 300 }}
            />
          </Grid>
          <Grid item>
            <Button variant='contained' onClick={submitForm}>
              Create account
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default Register;
