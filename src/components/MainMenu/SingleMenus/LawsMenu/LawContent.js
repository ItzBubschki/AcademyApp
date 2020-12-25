import React from 'react';
import LawObject from './LawObject';
import LawMenuHeader from '../../Header/LawMenuHeader';

class LawContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Verfassung: [],
            stgb: [],
            stpo: [],
            openMenu: 'Verfassung',
            openMenuId: 'constitution',
            error: ''
        };
        this.checkAuthentication().then(() => this.getLawList());
    }

    getLawList = () => {
        this.props.firebase
            .getCollection('Verfassung')
            .then((querySnapshot) => {
                let docs = [];
                querySnapshot.docs.forEach((doc) => {
                    let law = doc.data();
                    law['id'] = doc.id;
                    docs.push(law);
                });
                docs.sort(this.compare);
                this.setState({Verfassung: docs});
            })
            .catch((error) => {
                console.log(error);
                this.setState({error: error});
            });
        this.props.firebase
            .getCollection('STGB')
            .then((querySnapshot) => {
                let docs = [];
                querySnapshot.docs.forEach((doc) => {
                    let law = doc.data();
                    law['id'] = doc.id;
                    docs.push(law);
                });
                docs.sort(this.compare);
                this.setState({stgb: docs});
            })
            .catch((error) => {
                console.log(error);
                this.setState({error: error});
            });
        this.props.firebase
            .getCollection('STPO')
            .then((querySnapshot) => {
                let docs = [];
                querySnapshot.docs.forEach((doc) => {
                    let law = doc.data();
                    law['id'] = doc.id;
                    docs.push(law);
                });
                docs.sort(this.compare);
                this.setState({stpo: docs});
            })
            .catch((error) => {
                console.log(error);
                this.setState({error: error});
            });
    };

    switchLawMenu = (next) => {
        let nextMenu = '';
        switch (this.state.openMenu) {
            case 'StGB':
                if (next) {
                    nextMenu = 'StPO';
                } else {
                    nextMenu = 'Verfassung';
                }
                break;
            case 'StPO':
                if (next) {
                    nextMenu = 'Verfassung';
                } else {
                    nextMenu = 'StGB';
                }
                break;
            default:
                if (next) {
                    nextMenu = 'StGB';
                } else {
                    nextMenu = 'StPO';
                }
                break;
        }
        let nextMenuId;
        switch (nextMenu) {
            case 'Verfassung':
                nextMenuId = 'constitution';
                break;
            case 'StGB':
                nextMenuId = 'stgb';
                break;
            default:
                nextMenuId = 'stpo';
                break;
        }
        this.setState({openMenu: nextMenu, openMenuId: nextMenuId});
    };

    compare = (a, b) => {
        const aNumber = a.id.split(' ');
        const bNumber = b.id.split(' ');
        if (parseInt(aNumber[1]) < parseInt(bNumber[1])) {
            return -1;
        }
        if (parseInt(aNumber[1]) > parseInt(bNumber[1])) {
            return 1;
        }
        return 0;
    };

    checkAuthentication = async () => {
        const authenticated = await this.props.firebase.isUserLoggedIn();
        if (!authenticated) {
            await this.props.firebase.setStatePersistence('local').then(() => this.props.firebase.logInAnonymously());
        }
    };

    render() {
        let LawList;
        switch (this.state.openMenu) {
            case 'StGB':
                LawList = this.state.stgb.map((law) => (
                    <LawObject key={law.id} law={law}/>
                ));
                break;
            case 'StPO':
                LawList = this.state.stpo.map((law) => (
                    <LawObject key={law.id} law={law}/>
                ));
                break;
            default:
                LawList = this.state.Verfassung.map((law) => (
                    <LawObject key={law.id} law={law}/>
                ));
                break;
        }
        return (
            <div>
                <LawMenuHeader
                    handleClick={this.switchLawMenu}
                    lawTypeText={this.state.openMenu}
                    lawTypeId={`laws.${this.state.openMenuId}`}
                />
                <div style={{marginTop: '10vh'}}>{LawList}</div>
            </div>
        );
    }
}

export default LawContent;
