import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {withAuthentication} from "./Session";

import LandingPage from "./PreMMPages/Landing";
import SignUpPage from "./PreMMPages/SignUp";
import SignInPage from "./PreMMPages/SignIn";
import PasswordForgetPage from "./PreMMPages/PasswordForget";
import HomePage from "./MainMenu/SingleMenus/Home";
import Movies from "./MainMenu/SingleMenus/Movies";
import Laws from "./MainMenu/SingleMenus/LawsMenu";
import NameSelection from "./PreMMPages/NameSelection";
import MovieInspection from "./MainMenu/SingleMenus/Movies/MovieInspection";
import AddMovie from "./MainMenu/SingleMenus/Movies/AddMovie";
import VoteMenu from "./MainMenu/SingleMenus/VotingMenu/VoteMenu";
import RoundOverview from "./MainMenu/SingleMenus/VotingMenu/VoteMenu/RoundOverview";

import * as ROUTES from "../constants/routes";
import VotingMenu from "./MainMenu/SingleMenus/VotingMenu";

class App extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Switch>
                        <Route exact path={ROUTES.LANDING} component={LandingPage}/>
                        <Route path={ROUTES.SIGN_UP} component={SignUpPage}/>
                        <Route path={ROUTES.SIGN_IN} component={SignInPage}/>
                        <Route
                            path={ROUTES.PASSWORD_FORGET}
                            component={PasswordForgetPage}
                        />
                        <Route path={ROUTES.HOME} component={HomePage}/>{" "}
                        <Route
                            path={ROUTES.MOVIES}
                            render={({match: {url}}) => (
                                <>
                                    <Route path={`${url}`} component={Movies} exact/>
                                    <Route
                                        path={`${url}${ROUTES.ADD_MOVIE}`}
                                        component={AddMovie}
                                    />
                                    <Route
                                        path={`${url}${ROUTES.SINGLE_MOVIE}`}
                                        component={MovieInspection}
                                    />
                                </>
                            )}
                        />
                        <Route path={ROUTES.LAWS} component={Laws}/>
                        <Route
                            path={ROUTES.VOTING}
                            render={({match: {url}}) => (
                                <>
                                    <Route path={`${url}`} component={VotingMenu} exact/>
                                    <Route
                                        path={`${url}${ROUTES.SINGLE_VOTE}`}
                                        render={({match: {url}}) => (
                                            <>
                                                <Route path={`${url}`} component={VoteMenu} exact/>
                                                <Route
                                                    path={`${url}${ROUTES.ROUND_OVERVIEW}`}
                                                    component={RoundOverview}
                                                />
                                            </>
                                        )}
                                    />
                                </>
                            )}
                        />
                        <Route path={ROUTES.NAME_SELECTION} component={NameSelection}/>
                        <Route component={LandingPage}/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default withAuthentication(App);
