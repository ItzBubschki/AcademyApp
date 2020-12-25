import React from "react";
import * as ROUTES from "../../../constants/routes";

class Landing extends React.Component {
    render() {
        return <div>{this.props.history.push(ROUTES.HOME)}</div>;
    }
}

export default Landing;
