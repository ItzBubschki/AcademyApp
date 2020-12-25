import React from 'react';
import Button from '@material-ui/core/Button';
import * as ROUTES from '../../../constants/routes';
import SignOutButton from '../../PreMMPages/SignOut';

export default class LoginButton extends React.Component {
    constructor(props) {
        super(props);
        let loggedIn = JSON.parse(localStorage.getItem('loggedIn'));
        let loading = true;
        if (loggedIn !== null) {
            loading = false;
        }
        this.state = {
            loggedIn: loggedIn,
            loading: loading
        };
    }

    componentDidMount() {
        this.checkLoggedIn();
    }

    checkLoggedIn = async () => {
        const loggedIn = this.props.firebase.isUserActuallyLoggedIn();
        this.setState({loggedIn: loggedIn, loading: false});
        localStorage.setItem('loggedIn', loggedIn.toString());
    };

    logIn = () => {
        const currentPage = window.location.href.split('/')[3];
        const destination = ROUTES.SIGN_IN + `?redirect_to=${currentPage}`;
        this.props.history.push(destination);
    };

    render() {
        return (
            <div>
                {this.state.loading ? '' :
                    <div>
                        {
                            this.state.loggedIn ? <SignOutButton/> :
                                <Button variant="outlined" size="small" id="logInButton" onClick={this.logIn}>log
                                    in</Button>
                        }
                    </div>
                }
            </div>
        );
    }
}