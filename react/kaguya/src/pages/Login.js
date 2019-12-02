import React, { Component } from 'react';
import AuthService from '../components/AuthService';
import '../css/style.sass'
import { Link } from 'react-router-dom'
import queryString from 'query-string';

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            redirectURL: "/"
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.Auth = new AuthService();
        
        if (props.history.location.search){
            let q = queryString.parse(props.history.location.search)

            if ('redirect_after_login' in q){
                this.state.redirectURL = q.redirect_after_login

                if ('author' in q){
                    this.state.redirectURL += "&author=" + q.author
                }
                
                if ('collection' in q){
                    this.state.redirectURL += "&collection=" + q.collection
                }

                if ('page' in q){
                    this.state.redirectURL += "&page=" + q.page
                }
            }
        }
        document.title = "ログイン - かぐや"
    }
    render() {
        if(this.Auth.loggedIn()){
            this.props.history.replace(this.state.redirectURL);
        }
        return (
            <div>
            <div className="uk-navbar-container uk-navbar-transparent" uk-navbar="true">              
                <div className="uk-navbar-right">
                    <div className="uk-inline uk-visible@s">
                        <div className="uk-grid-small uk-child-width-expand@s uk-form-stacked" uk-grid="true">
                        </div>
                    </div>
                    <ul className="uk-navbar-nav">
                        <li>
                            <a className="uk-navbar-toggle" uk-navbar-toggle-icon="true"></a>
                            <div className="uk-navbar-dropdown">
                                <ul className="uk-nav uk-navbar-dropdown-nav">
                                    <li><Link to='/notice'>お知らせ</Link></li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="uk-section uk-flex uk-flex-middle uk-margin-large-top">
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
               this.props.history.replace(this.state.redirectURL);
            })
            .catch(err =>{
                alert(err);
            })
    }
}

export default Login;