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
import Main from './components/Main';
import Login from './components/Login';
import Signup from './components/Signup';
import { Context } from './Context';

const App = () => {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:3001/auth', {
        headers: {
          Authorization: localStorage.getItem('Authorization'),
        },
      })
      .then((res) => {
        if (res.data.error) {
          setAuth(false);
        } else {
          setAuth(true);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <Container maxWidth='lg'>
      <CssBaseline />
      <Router basename={process.env.PUBLIC_URL}>
        <Context.Provider value={{ setAuth, auth }}>
          <Navbar />
        </Context.Provider>
        <Switch>
          <Route exact path='/'>
            <Redirect to='/page/1' />
          </Route>
          <Route exact path='/page/:page'>
            <Main />
          </Route>
          <Context.Provider value={{ setAuth }}>
            <Route exact path='/login'>
              <Login />
            </Route>
            <Route exact path='/register'>
              <Signup />
            </Route>
          </Context.Provider>
        </Switch>
      </Router>
    </Container>
  );
};

export default App;
