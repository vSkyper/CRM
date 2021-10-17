import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ auth, loginOrSignup, children, ...rest }) => {
  if (loginOrSignup) {
    return <Route {...rest}>{!auth ? children : <Redirect to='/' />}</Route>;
  }
  return <Route {...rest}>{auth ? children : <Redirect to='/login' />}</Route>;
};

export default ProtectedRoute;
