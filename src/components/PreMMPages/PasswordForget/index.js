import React from 'react';
import {withRouter} from 'react-router-dom';
import {compose} from 'recompose';

import PasswordForgotFormBase from "./PasswordForgotFormBase";
import Link from "@material-ui/core/Link";
import {withFirebase} from '../../Firebase';
import * as ROUTES from '../../../constants/routes';

const PasswordForgotPage = () => (
    <div>
        <PasswordForgotForm/>
    </div>
);


const PasswordForgotForm = compose(
    withRouter,
    withFirebase,
)(PasswordForgotFormBase);

const PasswordForgetLink = () => (
    <p>
        <Link href={ROUTES.PASSWORD_FORGET} variant="body2">Forgot Password?</Link>
    </p>
);

export default PasswordForgotPage;

export {PasswordForgotForm, PasswordForgetLink};