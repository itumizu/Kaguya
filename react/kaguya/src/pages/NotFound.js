import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom'
// import './App.css';

class NotFound extends Component {
  constructor(props){
    super(props);
    document.title = "ページが存在しません - かぐや"
  }
  render() {
    return (
            <div class="uk-section uk-flex uk-flex-middle" uk-height-viewport="true">
                <div class="uk-width-1-1">
                    <div class="uk-container">
                        <div class="uk-grid-margin uk-grid uk-grid-stack" uk-grid="true">
                            <div class="uk-width-1-1@m">
                                <div class="uk-margin uk-width-large uk-margin-auto">
                                    <h1 class="kaguya uk-text-bold uk-text-center loginLogo uk-margin-bottom">かぐや</h1>
                                    <p class="uk-text-center">
                                        このページは存在しません。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NotFound

