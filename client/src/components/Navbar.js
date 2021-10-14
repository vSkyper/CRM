import { Button, AppBar, Toolbar, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <>
      <AppBar>
        <Toolbar>
          <Grid container spacing={2}>
            <Grid item>
              <Button variant='contained' component={Link} to='/'>
                Home
              </Button>
            </Grid>
            <Grid item>
              <Button variant='contained' component={Link} to='/register'>
                Register
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default Navbar;
