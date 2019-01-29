import React, { Component } from 'react';
import Items from './Items';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
// import FullScreenLoader from '../../components/FullScreenLoader';
// import { Query } from 'react-apollo';
// import { } from '../../apollo/queries';

class ItemsContainer extends Component {
    render() {
        return (
            <Items />
        );
    }
}

export default withStyles(styles)(ItemsContainer);