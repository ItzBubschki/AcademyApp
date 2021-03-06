import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import Logo from '../../Logo';
import {SignInLink} from '../SignIn';
import * as ROUTES from '../../../constants/routes';

import '../SignIn/style.css';

const INITIAL_STATE = {
    email: '',
    password: '',
    confirmPassword: '',
    rememberUser: false,
    error: '',
};

class SignInFormBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {...INITIAL_STATE};
    }

    onSubmit = (event) => {
        const {email, password} = this.state;
        const newPersistence = this.state.rememberUser ? 'local' : 'session';

        this.props.firebase
            .setStatePersistence(newPersistence)
            .then(() => {
                this.props.firebase.doCreateUserWithEmailAndPassword(email, password).then(() => {
                    this.setState({...INITIAL_STATE});
                    const redirect = new URLSearchParams(this.props.location.search).get('redirect_to');
                    if (redirect) {
                        this.props.history.push(redirect);
                    } else {
                        this.props.history.push(ROUTES.HOME);
                    }
                    this.props.history.push(ROUTES.HOME);
                }).catch((error) => {
                    this.setState({error});
                });
            })
            .catch((error) => {
                this.setState({error});
            });

        event.preventDefault();
    };

    onChange = (event) => {
        const {name, value, type, checked} = event.target;
        type === 'checkbox'
            ? this.setState({[name]: checked})
            : this.setState({[name]: value});
    };

    render() {
        return (
            <Container component="main" maxWidth="xs">
                <div className="paper">
                    <Logo
                        className="Logo"
                    />
                    <Typography component="h1" variant="h4">
                        Sign up
                    </Typography>
                    <Typography color="error">
                        Signing up doesn't add any functionality if you're not a core member of the Academy!
                    </Typography>
                    {this.state.error !== '' ? (
                        <ErrorMessage text={this.state.error.message}/>
                    ) : (
                        ''
                    )}
                    <form onSubmit={this.onSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={this.onChange}
                            value={this.state.email}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={this.onChange}
                            value={this.state.password}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                            autoComplete="confirm-password"
                            onChange={this.onChange}
                            value={this.state.confirmPassword}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary"/>}
                            label="Remember me"
                            onChange={this.onChange}
                            value={this.state.rememberUser}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className="submit"
                        >
                            Sign up
                        </Button>
                        <Grid container>
                            <Grid item>
                                <SignInLink/>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        );
    }
}

function ErrorMessage(props) {
    return (
        <Typography component="h2" variant="h6" color="error">
            {props.text}
        </Typography>
    );
}

export default SignInFormBase;
