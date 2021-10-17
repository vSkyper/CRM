import { useContext } from 'react';
import { Button, AppBar, Toolbar, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { Context } from '../Context';

const Navbar = () => {
  const { setRole, role } = useContext(Context);

  const logout = () => {
    localStorage.removeItem('Authorization');
    setRole(null);
  };

  return (
    <>
      <AppBar>
        <Toolbar>
          <Grid container spacing={2}>
            {!role ? (
              <>
                <Grid item>
                  <Button variant='contained' component={Link} to='/login'>
                    Log in
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant='contained' component={Link} to='/register'>
                    Sign up
                  </Button>
                </Grid>
              </>
            ) : (
              <>
                <Grid item>
                  <Button variant='contained' component={Link} to='/'>
                    Home
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant='contained' onClick={logout}>
                    Logout
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default Navbar;
