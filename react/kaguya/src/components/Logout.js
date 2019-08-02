import React, { Component } from 'react';
// import { Redirect } from 'react-router-dom';
import AuthService from './AuthService';

class Logout extends Component {
    constructor(props){
        super(props);
        this.Auth = new AuthService();
    }
    render() {
        console.log("AUTHLOG")
        console.log(this.Auth.loggedIn())
        if(this.Auth.loggedIn()){
            if(this.Auth.logout()){
                this.props.history.replace('/login');
            }
        }
        else{
            // this.props.history.replace('/')
        }
        return (
            // <Redirect to={'login'}></Redirect>
            <div>
                
            </div>
        );
    }
}

export default Logout;