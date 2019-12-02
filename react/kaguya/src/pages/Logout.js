import React, { Component } from 'react';
import AuthService from '../components/AuthService';

class Logout extends Component {
    constructor(props){
        super(props);
        this.Auth = new AuthService();
        document.title = "ログアウト - かぐや"
    }
    render() {
        if(this.Auth.loggedIn()){
            if(this.Auth.logout()){
                this.props.history.replace('/login');
            }
        }
        else{
            this.props.history.replace('/')
        }
        return (
            <div></div>
        );
    }
}

export default Logout;