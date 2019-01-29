import React, { Component } from 'react';
import Share from './Share';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
// import FullScreenLoader from '../../components/FullScreenLoader';
// import { Query } from 'react-apollo';
// import { } from '../../apollo/queries';

class ShareContainer extends Component {
  render() {
    return (
      <Share />
    );
  }
}

export default withStyles(styles)(ShareContainer);