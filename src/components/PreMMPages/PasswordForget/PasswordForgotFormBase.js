import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import * as ROUTES from "../../../constants/routes";

import Logo from "../../Logo";

import "../SignIn/style.css";
import {SignInLink} from "../SignIn";
import {Grid} from "@material-ui/core";

const INITIAL_STATE = {
    email: "",
    error: null,
};

class PasswordForgetFormBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {...INITIAL_STATE};
    }

    onSubmit = (event) => {
        const {password} = this.state;

        this.props.firebase
            .doPasswordReset(password)
            .then(() => {
                this.setState({...INITIAL_STATE});
                this.props.history.push(ROUTES.SIGN_IN);
            })
            .catch((error) => {
                this.setState({error});
            });

        event.preventDefault();
    };

    onChange = (event) => {
        const {name, value} = event.target;
        this.setState({[name]: value});
    };

    render() {
        return (
            <Container component="main" maxWidth="xs">
                <div className="paper">
                    <Logo
                        className="Logo"
                    />
                    <Typography component="h1" variant="h5">
                        Forgot password
                    </Typography>
                    <form noValidate onSubmit={this.onSubmit}>
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
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className="submit"
                        >
                            Forgot password
                        </Button>
                        <Grid container>
                            <Grid item>
                                <SignInLink/>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={8}></Box>
            </Container>
        );
    }
}

export default PasswordForgetFormBase;
