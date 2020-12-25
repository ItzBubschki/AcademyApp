import React from "react";
import Link from "@material-ui/core/Link";

import * as ROUTES from "../../constants/routes";
import SignOutButton from "../PreMMPages/SignOut";
import {AuthUserContext} from "../Session";

const Navigation = ({authUser}) => (
    <div>
        <AuthUserContext.Consumer>
            {(authUser) => (authUser ? <NavigationAuth/> : <NavigationNonAuth/>)}
        </AuthUserContext.Consumer>
    </div>
);

const NavigationAuth = () => (
    <ul>
        <li>
            <Link href={ROUTES.HOME}>Home</Link>
        </li>
        <li>
            <SignOutButton/>
        </li>
    </ul>
);

const NavigationNonAuth = () => (
    <ul>
        <li>
            <Link href={ROUTES.LANDING}>Landing</Link>
        </li>
        <li>
            <Link href={ROUTES.SIGN_IN}>Sign In</Link>
        </li>
        <li>
            <Link href={ROUTES.SIGN_UP}>Sign Up</Link>
        </li>
    </ul>
);

export default Navigation;
