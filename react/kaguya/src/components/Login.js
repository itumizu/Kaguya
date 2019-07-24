import React, { Component } from 'react';
import AuthService from './AuthService';
import '../css/style.sass'

class Login extends Component {
    constructor(){
        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.Auth = new AuthService();
    }
    render() {
        console.log(this.Auth.loggedIn())
        if(this.Auth.loggedIn()){
            this.props.history.replace('/');
        }
        return (
            <div className="uk-section uk-flex uk-flex-middle" uk-height-viewport="true">
                <div className="uk-width-1-1">
                    <div className="uk-container">
                        <div className="uk-grid-margin uk-grid uk-grid-stack uk-grid">
                            <div className="uk-width-1-1@m">
                                <div className="uk-margin uk-width-large uk-margin-auto">
                                    <h1 className="kaguya uk-text-bold uk-text-center loginLogo">かぐや</h1>
                                    <form onSubmit={this.handleFormSubmit}>
                                        <div className="uk-margin">
                                            <div className="uk-form-label">
                                                ユーザー名
                                            </div>
                                            <div className="uk-inline uk-width-1-1">
                                                <span className="uk-form-icon" uk-icon="icon: user"></span>
                                                <input 
                                                    className="uk-input uk-form-medium"
                                                    name="username" 
                                                    type="text" 
                                                    onChange={this.handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="uk-margin">
                                            <div className="uk-form-label">
                                                パスワード
                                            </div>
                                            <div className="uk-inline uk-width-1-1">
                                                <span className="uk-form-icon" uk-icon="icon: lock"></span>
                                                <input 
                                                    name="password" 
                                                    className="uk-input uk-form-medium" 
                                                    type="password"
                                                    onChange={this.handleChange}                                                
                                                />	
                                            </div>
                                        </div>
                                        <input type="hidden" name="next" value="" />
                                        <div className="uk-margin">
                                            <input type="submit" 
                                                className="uk-button uk-button-large uk-width-1-1 login" 
                                                value="ログイン"
                                                onChange={this.handleFormSubmit}
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    handleChange(e){
        this.setState(
            {
                [e.target.name]: e.target.value
            }
        )
    }

    handleFormSubmit(e){
        e.preventDefault();
      
        this.Auth.login(this.state.username,this.state.password)
            .then(res =>{
               this.props.history.replace('/');
            })
            .catch(err =>{
                alert(err);
            })
    }
}

export default Login;