import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AccountForm from '../../components/AccountForm';


const Home = ({ classes }) => {
  return (
    <Grid
      container
      className={classes.root}
      direction="row"
      alignItems="center"
      justify="center"
    >
      <Grid item xs={12} sm={12} md={6}>
        <Typography
          variant="button"
          gutterBottom
          className={classes.subheading}
        >
          Boomtown
        </Typography>
        <Typography variant="display4" className={classes.headline}>
          Share. Borrow. Prosper.
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Typography gutterBottom variant="headline">
          Welcome home.
        </Typography>
        <AccountForm />
      </Grid>
    </Grid>
  );
};

export default Home;
