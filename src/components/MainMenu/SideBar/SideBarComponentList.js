import React from 'react';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import * as ROUTES from '../../../constants/routes';
import './style.css';

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
                        text="Filme"
                        itemKey="Movies"
                        route={ROUTES.MOVIES}
                        imageHeight="50"
                        currentMenu={this.props.match.path}
                        openMenu={this.openMenu}
                    />
                    <Divider/>
                    <SideBarComponent
                        imageRoute={'Images/verfassung.png'}
                        text="Gesetze"
                        itemKey="Laws"
                        route={ROUTES.LAWS}
                        imageHeight="60"
                        currentMenu={this.props.match.path}
                        openMenu={this.openMenu}
                    />
                    <Divider/>
                    {this.state.hasFullAccess ?
                        <SideBarComponent imageRoute={'Images/vote.png '} text="Wahl"
                                          itemKey="Voting"
                                          route={ROUTES.VOTING}
                                          imageHeight="50"
                                          currentMenu={this.props.match.path}
                                          openMenu={this.openMenu}
                        /> : ''}

                </List>
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
            <ListItemText primary={props.text}/>
        </ListItem>
    );
}

function Divider() {
    return <div style={{height: '2vh'}}/>;
}

export default SideBarComponentList;
