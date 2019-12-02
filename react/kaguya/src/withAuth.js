import React, { Component } from 'react';
import AuthService from './components/AuthService';
import { withRouter } from 'react-router';

export default function withAuth(AuthComponent) {
    const Auth = new AuthService();
    
    return class AuthWrapped extends Component {
        constructor(props) {
            super(props);

            this.state = {
                user: null
            };

            if (!Auth.loggedIn()) {
                let redirectUrl = "redirect_after_login=" + this.props.history.location.pathname + this.props.history.location.search
                
                this.props.history.replace({
                    pathname: '/login',
                    search: redirectUrl
                })
            }
            else {
                try {
                    const profile = Auth.getProfile()
                    this.state.user = profile;
                }
                catch(err){
                    Auth.logout()
                    this.props.history.replace('/login')
                }
            }
        }
        render() {
            if (this.state.user) {
                return (
                    <AuthComponent history={this.props.history} user={this.state.user} />
                )
            }
            else {
                return null
            }
            
        }
    }
}