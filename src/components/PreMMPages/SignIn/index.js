import React from 'react';
import {withRouter} from 'react-router-dom';
import {compose} from 'recompose';
import Link from '@material-ui/core/Link';

import SignInFormBase from './SignInFormBase';
import {withFirebase} from '../../Firebase';
import * as ROUTES from '../../../constants/routes';

const SignInPage = () => (
    <div>
        <SignInForm/>
    </div>
);

const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);

const SignInLink = () => (
    <p>
        <Link href={getRedirectLink()}>Sign In</Link>
    </p>
);

const getRedirectLink = () => {
    const redirect = new URLSearchParams(window.location.search).get('redirect_to');
    if (redirect) {
        return `${ROUTES.SIGN_IN}?redirect_to=${redirect}`;
    } else {
        return ROUTES.SIGN_IN;
    }
};

export default SignInPage;

export {SignInForm, SignInLink};
