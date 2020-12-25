import React from 'react';
import {withRouter} from 'react-router-dom';
import {compose} from 'recompose';

import Link from '@material-ui/core/Link';
import SignUpFormBase from './SignUpFormBase';
import {withFirebase} from '../../Firebase';
import * as ROUTES from '../../../constants/routes';

const SignUpPage = () => (
    <div>
        <SignUpForm/>
    </div>
);

const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase);

const SignUpLink = () => (
    <p>
        <Link href={getRedirectLink()}>
            Sign up
        </Link>
    </p>
);

const getRedirectLink = () => {
    const redirect = new URLSearchParams(window.location.search).get('redirect_to');
    if (redirect) {
        return `${ROUTES.SIGN_UP}?redirect_to=${redirect}`;
    } else {
        return ROUTES.SIGN_UP;
    }
};
export default SignUpPage;

export {SignUpForm, SignUpLink};
