import React from 'react';
import {Container} from '@material-ui/core';
import Logo from '../../../Logo';
import './style.css';

class HomeContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            President: '',
            Vice: '',
            Members: []
        };
        this.checkAuthentication().then(() => this.updateMembers());
    }

    updateMembers = () => {
        //get the latest president and vice
        this.props.firebase
            .queryAndOrderAndLimitCollection(
                'Voting',
                'votingDate',
                'desc',
                1,
                'Completed',
                '==',
                true
            )
            .then((querySnapshot) => {
                const doc = Object.values(querySnapshot.docs)[0];
                const data = doc.data();
                this.setState({
                    President: data.President,
                    Vice: data.Vice
                });
            })
            .catch((error) => {
                console.log(error);
            });

        //get all members
        this.props.firebase
            .getDocument('Members', 'Members')
            .then((documentSnapshot) => {
                const data = documentSnapshot.data();
                let namesArray = [];
                Object.keys(data.PlayerPrefs).forEach((element) => {
                    if (element !== this.state.President && element !== this.state.Vice) {
                        namesArray.push(element);
                    }
                });
                this.setState({Members: namesArray});
            })
            .catch((error) => {
                console.log(error);
            });
    };

    checkAuthentication = async () => {
        const authenticated = await this.props.firebase.isUserLoggedIn();
        if (!authenticated) {
            await this.props.firebase.setStatePersistence('local').then(() => this.props.firebase.logInAnonymously());
        }
    };

    render() {
        const MembersList = this.state.Members.map((member) => (
            <MemberElement key={member} memberName={member}/>
        ));
        return (
            <div id="membersOverview">
                <Container id="mainContainer" component="main" maxWidth="xs">
                    <div className="President">
                        <p>Präsident: {this.state.President}</p>
                    </div>
                    <div className="Vice">
                        <p>Vizepräsident: {this.state.Vice}</p>
                    </div>
                    <div className="Members">
                        <p>Vorstand:</p>
                        {MembersList}
                    </div>
                    <div className="spacer"/>
                    <div className="MainMenuLogo">
                        <Logo
                            className="mmLogo"
                        />
                    </div>
                </Container>
            </div>
        );
    }
}

function MemberElement(props) {
    return (
        <p>
            {props.memberName} <br/>
        </p>
    );
}

export default HomeContent;
