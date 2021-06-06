import React from 'react';
import {Container} from '@material-ui/core';
import Logo from '../../../Logo';
import './style.css';
import {FormattedMessage} from 'react-intl';

class HomeContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            President: '',
            Vice: '',
            Members: [],
        };
        this.updateMembers();
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
                true,
            )
            .then((querySnapshot) => {
                const doc = Object.values(querySnapshot.docs)[0];
                const data = doc.data();
                this.setState({
                    President: data.President,
                    Vice: data.Vice,
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

    render() {
        const MembersList = this.state.Members.map((member) => (
            <MemberElement key={member} memberName={member}/>
        ));
        return (
            <div id="membersOverview">
                <Container id="mainContainer" component="main" maxWidth="xs">
                    <div className="President">
                        <p><FormattedMessage id={'main.president'}
                                             defaultMessage={'President'}/>: {this.state.President}
                        </p>
                    </div>
                    <div className="Vice">
                        <p><FormattedMessage id={'main.vice_president'}
                                             defaultMessage={'Vice president'}/>: {this.state.Vice}</p>
                    </div>
                    <div className="Members">
                        <p><FormattedMessage id={'main.committee'} defaultMessage={'Committee'}/>:</p>
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
