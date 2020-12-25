import React from "react";
import NameButton from "./NameButton";
import {Container} from "@material-ui/core";
import * as ROUTES from "../../../constants/routes";

class NameList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            UserNames: [],
        };
        this.generateButtonList();
        this.checkMembership();
    }

    checkMembership = async () => {
        const isMember = await this.props.firebase.checkFullAccess();
        if (!isMember) {
            this.handleClick("Guest");
        }
    };

    generateButtonList = () => {
        this.props.firebase
            .getDocument("Members", "Members")
            .then((documentSnapshot) => {
                const data = documentSnapshot.data();
                let namesArray = [];
                Object.keys(data.PlayerPrefs).forEach((element) => {
                    namesArray.push(element);
                });
                this.setState({UserNames: namesArray});
            })
            .catch((error) => {
                console.log(error);
            });
    };

    handleClick = (UserName) => {
        localStorage.setItem("AcademyName", UserName);
        this.props.history.push(ROUTES.HOME);
    };

    render() {
        const NameButtons = this.state.UserNames.map((UserName) => (
            <NameButton
                key={UserName}
                UserName={UserName}
                handleClick={this.handleClick}
            />
        ));
        return <Container>{NameButtons}</Container>;
    }
}

export default NameList;
