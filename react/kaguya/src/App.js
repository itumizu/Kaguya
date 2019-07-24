import React, { Component } from 'react';
import withAuth from './withAuth'
import { BrowserRouter, Route, Link } from 'react-router-dom'
// import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    console.log(props)
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
    this.props.history.push({
      pathname: '/search',
      search: `?q=${this.state.q}`,
    })
  }
  render() {
    return (
      <div>
        <div className="uk-navbar-container uk-navbar-transparent" uk-navbar="true">
          <div className="uk-navbar-right">
              <ul className="uk-navbar-nav">
                <li>
                  <a className="uk-navbar-toggle" uk-navbar-toggle-icon="true" href=""></a>
                  <div className="uk-navbar-dropdown">
                      <ul className="uk-nav uk-navbar-dropdown-nav">
                        <li><Link to='/logout'>ログアウト</Link></li>
                      </ul>
                  </div>
                </li>
              </ul>
          </div>
        </div>
          <div className="uk-flex uk-flex-column uk-position-center">
            <h1 className="uk-text-center uk-margin topLogo uk-text-bold">かぐや</h1>
            <form name="searchForm" action="javascript:void(0)" onSubmit={this.handleFormSubmit} className="uk-margin" autoComplete="off">
                <div className="uk-margin uk-margin-left uk-margin-right">
                    <div className="uk-inline uk-box-shadow-hover-medium">
                        <a className="uk-form-icon uk-form-icon-flip" href="javascript:searchForm.submit()" uk-icon="icon: search"></a>
                        <input className="uk-input uk-form-width-large" type="text" name="q" onChange={this.handleChange}/>
                    </div>
                </div>
            </form>
          </div>
        </div>
    );
  }
}

export default withAuth(App);