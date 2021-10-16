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

const App = () => {
  return (
    <Container maxWidth='lg'>
      <CssBaseline />
      <Router basename={process.env.PUBLIC_URL}>
        <Navbar />
        <Switch>
          <Route exact path='/'>
            <Redirect to='/page/1' />
          </Route>
          <Route exact path='/page/:page'>
            <Main />
          </Route>
          <Route exact path='/login'>
            <Login />
          </Route>
          <Route exact path='/register'>
            <Signup />
          </Route>
        </Switch>
      </Router>
    </Container>
  );
};

export default App;
