import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SideBar from '../SideBar';
import {withRouter} from 'react-router-dom';
import {compose} from 'recompose';
import LoginButton from './login';
import './style.css';
import {withFirebase} from '../../Firebase';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mounted: false
        };
    }

    componentDidMount() {
        this.setState({mounted: true});
    }

    render() {
        return (
            <header>
                <AppBar position="fixed" color="secondary" id="mainHeader">
                    <Toolbar>
                        <SideBar/>
                        <div style={{flexGrow: '1'}}/>
                        {this.state.mounted ? <LoginButtonBase/> : ''}
                    </Toolbar>
                </AppBar>
            </header>
        );
    }
}

const LoginButtonBase = compose(withRouter, withFirebase)(LoginButton);

export default Header;
