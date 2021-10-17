import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, CssBaseline } from '@mui/material';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Navbar from './components/Navbar';
import Users from './components/Users';
import UsersAdmin from './components/UsersAdmin';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './ProtectedRoute';
import { Context } from './Context';

const App = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:3001/auth', {
        headers: {
          Authorization: localStorage.getItem('Authorization'),
        },
      })
      .then((res) => {
        if (res.data.error) {
          setRole(null);
        } else {
          setRole(res.data.role);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <Container maxWidth='lg'>
      <CssBaseline />
      <Router basename={process.env.PUBLIC_URL}>
        <Context.Provider value={{ setRole, role }}>
          <Navbar />
        </Context.Provider>
        <Switch>
          <Route exact path='/'>
            <Redirect to='/page/1' />
          </Route>
          <ProtectedRoute
            exact
            path='/page/:page'
            auth={role}
            loginOrSignup={false}
          >
            <Context.Provider value={{ setRole }}>
              {role === 'user' && <Users />}
              {role === 'admin' && <UsersAdmin />}
            </Context.Provider>
          </ProtectedRoute>
          <ProtectedRoute exact path='/login' auth={role} loginOrSignup={true}>
            <Context.Provider value={{ setRole }}>
              <Login />
            </Context.Provider>
          </ProtectedRoute>
          <ProtectedRoute
            exact
            path='/register'
            auth={role}
            loginOrSignup={true}
          >
            <Signup />
          </ProtectedRoute>
        </Switch>
      </Router>
    </Container>
  );
};

export default App;
