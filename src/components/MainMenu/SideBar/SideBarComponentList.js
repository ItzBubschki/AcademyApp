import React from 'react';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import {FormattedMessage} from 'react-intl';
import * as ROUTES from '../../../constants/routes';
import './style.css';
import {ListItemText} from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

class SideBarComponentList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            hasFullAccess: false
        };
    }

    componentDidMount() {
        this.checkAuthentication();
    }

    checkAuthentication = async () => {
        if (this.props.firebase.isUserActuallyLoggedIn()) {
            const hasFullAccess = await this.props.firebase.checkFullAccess();
            this.setState({authenticated: true, hasFullAccess: hasFullAccess});
        }
    };
    openMenu = (newMenu) => {
        this.props.history.push(newMenu);
    };

    render() {
        return (
            <div>
                <List className="itemList">
                    <SideBarComponent
                        imageRoute={'Images/home.png'}
                        text="Home"
                        itemKey="Home"
                        route={ROUTES.HOME}
                        imageHeight="50"
                        currentMenu={this.props.match.path}
                        openMenu={this.openMenu}
                    />
                    <Divider/>
                    <SideBarComponent
                        imageRoute={'Images/filme.png'}
                        text="Movies"
                        itemKey="Movies"
                        route={ROUTES.MOVIES}
                        imageHeight="50"
                        currentMenu={this.props.match.path}
                        openMenu={this.openMenu}
                    />
                    <Divider/>
                    <SideBarComponent
                        imageRoute={'Images/verfassung.png'}
                        text="Laws"
                        itemKey="Laws"
                        route={ROUTES.LAWS}
                        imageHeight="60"
                        currentMenu={this.props.match.path}
                        openMenu={this.openMenu}
                    />
                    <Divider/>
                    {this.state.hasFullAccess ?
                        <SideBarComponent imageRoute={'Images/vote.png '} text="Voting"
                                          itemKey="Voting"
                                          route={ROUTES.VOTING}
                                          imageHeight="50"
                                          currentMenu={this.props.match.path}
                                          openMenu={this.openMenu}
                        /> : ''}

                </List>
                <div id="help-icon" onClick={() => this.openMenu(ROUTES.IMPRINT)}>
                    <HelpOutlineIcon/>
                </div>
            </div>
        );
    }
}

function SideBarComponent(props) {
    return (
        <ListItem
            button
            key={props.text}
            selected={props.currentMenu.includes(props.itemKey)}
            onClick={() => props.openMenu(props.route)}
            className="singleItem"
        >
            <ListItemIcon>
                <img
                    src={'/' + props.imageRoute}
                    alt={props.itemKey}
                    width="50"
                    height={props.imageHeight}
                />
            </ListItemIcon>
            <ListItemText><FormattedMessage id={`sidebar.${props.itemKey}`} defaultMessage={props.text}/></ListItemText>
        </ListItem>
    );
}

function Divider() {
    return <div style={{height: '2vh'}}/>;
}

export default SideBarComponentList;
