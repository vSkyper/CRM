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
  Grid,
} from '@mui/material';

const getUsers = (setUsers, page, setTotalPages) => {
  axios
    .get(`http://localhost:3001/users/${page}`)
    .then((res) => {
      setUsers(res.data.rows);
      setTotalPages(res.data.totalPages);
    })
    .catch((error) => console.log(error));
};

const Main = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [editID, setEditID] = useState(null);
  const [editLogin, setEditLogin] = useState('');
  const [editName, setEditName] = useState('');
  const [editSurname, setEditSurname] = useState('');
  const [editDateOfBirth, setEditDateOfBirth] = useState('');

  useEffect(() => {
    getUsers(setUsers, page, setTotalPages);
  }, [page]);

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
        getUsers(setUsers, page, setTotalPages);
        setEditID(null);
      })
      .catch((error) => console.log(error));
  };

  const deleteUser = (id) => {
    axios
      .delete('http://localhost:3001/deleteUser', { data: { id } })
      .then(() => {
        getUsers(setUsers, page, setTotalPages);
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 50 }}>ID</TableCell>
              <TableCell sx={{ width: 300 }}>Login</TableCell>
              <TableCell sx={{ width: 300 }}>Name</TableCell>
              <TableCell sx={{ width: 300 }}>Surname</TableCell>
              <TableCell sx={{ width: 300 }}>Birthdate</TableCell>
              <TableCell sx={{ width: 100 }}></TableCell>
              <TableCell sx={{ width: 100 }}></TableCell>
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
                        sx={{ width: 180 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        label='Name'
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        sx={{ width: 180 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        label='Surname'
                        value={editSurname}
                        onChange={(e) => setEditSurname(e.target.value)}
                        sx={{ width: 180 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        label='Birthdate'
                        value={editDateOfBirth}
                        type='date'
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) => setEditDateOfBirth(e.target.value)}
                        sx={{ width: 165 }}
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
      <Grid container spacing={2} sx={{ mt: 2, mb: 5 }}>
        {[...Array(totalPages)].map((page, pageID) => (
          <Grid item key={pageID}>
            <Button
              variant='contained'
              onClick={() => {
                setPage(pageID);
                window.scrollTo(0, 0);
              }}
            >
              {pageID + 1}
            </Button>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Main;
