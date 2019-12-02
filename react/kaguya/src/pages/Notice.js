import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import axios from "axios";
import AuthService from "../components/AuthService";
import { withRouter } from "react-router-dom";
import moment from "moment";

class Notice extends Component {
    constructor(props){
        super(props);

        this.state = {
            list: null,
            displayList: false,
        }

        this.Auth = new AuthService();
        this.setInformation = this.setInformation.bind(this)
        this.getInformation()
        document.title = "お知らせ - かぐや"
    }
    render() {
        return (
        <div>
            <div className="uk-navbar-container uk-navbar-transparent" uk-navbar="true">
                <div className="uk-navbar-center">
                    <Link className="uk-navbar-item uk-text-center uk-hidden@m uk-text-bold uk-logo" to='/'>かぐや</Link>
                </div>

                <div className="uk-navbar-left">
                    <Link className="uk-navbar-item uk-visible@m kaguya uk-text-bold uk-logo" to='/'>かぐや</Link>
                </div>
                
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
                                    {/* <li><Link to='/notice'>お知らせ</Link></li> */}
                                    {(() => {
                                        if (this.Auth.loggedIn()){
                                            return <li><Link to='/logout'>ログアウト</Link></li>
                                        }
                                        else{
                                            return <li><Link to='/'>トップへ</Link></li>
                                        }
                                    })()}                  
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <hr></hr>
            <h3 className="uk-margin-medium-left">お知らせ</h3>
            <div className="uk-align-center uk-margin-medium-left uk-margin-medium-right uk-margin-remove-adjacent" uk-grid="true">
                {(() => {
                    if (this.state.displayList) {
                        return (
                            <table className="uk-table uk-table-justify uk-table-divider">
                                <thead>
                                    <tr>
                                        <th className="uk-width-small">日時</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.list}
                                </tbody>
                            </table>
                        )
                    }
                    else{
                        return <div className="uk-text-center" uk-spinner="ratio: 4.5"></div>
                    }
                })()}
            </div>
        </div>
        )
    }
    getInformation(){
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        return axios.get(`${this.Auth.domain}/api/v1/notice/`, {
            headers,
        })
        .then((response) => {
            // console.log(response)
            this.setInformation(response.data.results)
            return response.data.results
        })
        .catch((e) => {
            console.log(e)
            throw e
        })
    }
    setInformation(data){
        let list = []

        data.forEach(element => {
            list.push(
                <tr>
                    <td>{moment(element.created_at).format('YYYY/MM/DD HH:mm:ss')}</td>
                    <td><b>{element.title}</b><br/>{element.body}</td>
                </tr>
            )
        });
        
        this.setState({
            list: list,
            displayList: true
        })
    }
}

export default withRouter(Notice);