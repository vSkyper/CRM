import { useState, useEffect, useContext, useCallback } from 'react';
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
  Grid,
} from '@mui/material';
import { useHistory, useParams } from 'react-router-dom';
import { Context } from '../Context';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const history = useHistory();
  const { page } = useParams();

  const { setRole } = useContext(Context);

  const getUsers = useCallback(() => {
    axios
      .get(`http://localhost:3001/users/${page}`, {
        headers: {
          Authorization: localStorage.getItem('Authorization'),
        },
      })
      .then((res) => {
        if (res.data.error) {
          if (res.data.error === 'Unauthorized') {
            setRole(null);
          } else {
            console.log(res.data.error);
          }
        } else {
          setUsers(res.data.rows);
          setTotalPages(res.data.totalPages);
        }
      })
      .catch((error) => console.log(error));
  }, [page, setRole]);

  useEffect(() => {
    getUsers();
  }, [page, getUsers]);

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
              onClick={() => history.push(`/page/${pageID + 1}`)}
            >
              {pageID + 1}
            </Button>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Users;
