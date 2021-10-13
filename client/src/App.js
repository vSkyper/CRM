import { Container, CssBaseline, Button } from '@mui/material';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Main from './components/Main';
import Register from './components/Register';

const App = () => {
  return (
    <Container maxWidth='lg'>
      <CssBaseline />
      <Router basename={process.env.PUBLIC_URL}>
        <Button variant='contained' component={Link} to='/register'>
          Register
        </Button>
        <Switch>
          <Route exact path='/'>
            <Main />
          </Route>
          <Route exact path='/register'>
            <Register />
          </Route>
        </Switch>
      </Router>
    </Container>
  );
};

export default App;
