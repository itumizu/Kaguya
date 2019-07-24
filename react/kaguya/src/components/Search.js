import React, { Component } from 'react';
import withAuth from '../withAuth'
import AuthService from './AuthService';

import { withRouter, BrowserRouter, Route, Link } from 'react-router-dom';
import '../css/style.sass';
import queryString from 'query-string';

class Search extends Component {
    constructor(props){
        super(props);

        this.state = {
            q: "",
            page: null,
            list: [""],
            paginationList: null,
            count: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.Auth = new AuthService();

        if (props.history.location.search){
            let q = queryString.parse(props.history.location.search)
            if ('q' in q){
                if ('page' in q && !isNaN(q['page'])){
                    this.state['q'] = q['q']
                    this.state['page'] = q['page']
                }
                else{
                    this.state['q'] = q['q']
                    this.state['page'] = q['page']     
                }
            }
            if (this.state.q !== ""){
                this.search(this.state.q, this.state.page)
            }
        }

        props.history.listen((location, action) => {
            if (location.search){
                let q = queryString.parse(location.search)
                if ('q' in q){
                    if ('page' in q && !isNaN(q['page'])){
                        this.state['q'] = q['q']
                        this.state['page'] = q['page']   
                    }
                    else{
                        this.state['q'] = q['q']
                        this.state['page'] = 1
                    }
                }
            }
            if (this.state.q !== ""){
                this.search(this.state.q, this.state.page)
            }
            else{
                this.state = {
                    q: "",
                    page: null,
                    list: [],
                    paginationList: null,
                    count: null
                };
                this.setState(this.state)
            }
        })
    }
    search(query, page=1){
        let offset = (page - 1) * 50
        let limit = 50

        if(isNaN(page)){
            this.props.history.push({
                pathname: '/search',
                search: `?q=${this.state.q}`,
            })
        }
        else{
            if (page !== 1){
                try{
                    page = parseInt(page)
                }
                catch{
                    page = 1
                }
            }
        }

        return this.Auth.fetch(`${this.Auth.domain}/api/v1/haikai/?query=${query}&offset=${offset}&limit=${limit}`, {
            method: 'GET'
        })
        .then(res => {
            this.renderResult(res, page)
            return res
        })
    }
    renderResult(res, page){
        let list = []
        let paginationList = []
        let count = res.count;
        let paginations = this.pagination(page, Math.ceil(count / 50))
        
        for(var i in res.results){
            let result = res.results[i]

            list.push(
                <div className="uk-card uk-card-default uk-card-body uk-align-center uk-margin-medium-left uk-margin-medium-right uk-margin-remove-adjacent" uk-grid="true">
                    {result.firstPart && result.secondPart && result.lastPart ? <p className="kaguya largeText">{result.firstPart}　{result.secondPart}　{result.lastPart}</p> : <p className="kaguya largeText">{result.firstPartKana}　{result.secondPartKana}　{result.lastPartKana}</p>}
                    <div className="uk-flex uk-align-right">
                        {result.author && <a className="uk-text-break badgeText uk-margin-small-right" href="#" >{result.author.name}</a> }
                        {result.collection && <a className="uk-text-break badgeText" href="#" >{result.collection.name}</a>}
                        {result.collection.parent && <a className="uk-text-break badgeText uk-margin-small-left" href="#" >{result.collection.parent.name}</a>}
                    </div>
                </div>
            );
        }
        if (count > 0 && page <= Math.ceil(count / 50) && page > 0){
            if (page !== 1)
            {
                paginationList.push(
                    <li>
                        <a className="page-link" href="#" onClick={e => this.changePage(e,　1)}>{1}</a>
                    </li>
                )
                paginationList.push(
                    <li>
                        <a className="page-link" href="#" onClick={e => this.changePage(e,　paginations[0])}>&lt;</a>
                    </li>
                )
            }
            for (let n in paginations){
                n = paginations[n]
                paginationList.push(
                    <li>
                        <a className="page-link" href="#" onClick={e => this.changePage(e,　n)}>{n}</a>
                    </li>
                );
            }
            if (page !== Math.ceil(count / 50)){
                paginationList.push(
                    <li>
                        <a className="page-link" href="#" onClick={e => this.changePage(e,　paginations[-1])}>&gt;</a>
                    </li>
                )
                paginationList.push(
                    <li>
                        <a className="page-link" href="#" onClick={e => this.changePage(e,　Math.ceil(count / 50))}>{Math.ceil(count / 50)}</a>
                    </li>
                )
            }
        }
        else{
            if(count > 0 && page > Math.ceil(count / 50)){
                this.props.history.push({
                    pathname: '/search',
                    search: `?q=${this.state.q}&page=${Math.ceil(count / 50)}`,
                })
            }
            else if (count > 0 && page < 1){
                this.props.history.push({
                    pathname: '/search',
                    search: `?q=${this.state.q}`,
                })
            }
        }

        this.setState({
            'list': list,
            'paginationList': paginationList,
            'count': count,
            'page': page
        })
    }

    pagination(currentPage, pageLength){
        let pageList = []
        if (pageLength > 2 * 3){
            let startIndex = Math.max(1, currentPage - 3)
            let endIndex = Math.min(pageLength, currentPage + 3)

            if (endIndex < startIndex + 2 * 3){
                endIndex = startIndex + 2 * 3
            }
            else if(startIndex > endIndex - 2 * 3){
                startIndex = endIndex - 2 * 3
            }
            
            if (startIndex < 1){
                endIndex -= startIndex
                startIndex = 1
            }
            else if(endIndex > pageLength){
                startIndex -= (endIndex - pageLength)
                endIndex = pageLength
            }

            for (var i of Array(endIndex - startIndex).keys()){
                pageList.push(i + startIndex)
            }

            return pageList.slice(0, (2 * 3 + 1));
        }

        for (var i of Array(pageLength).keys()){
            pageList.push(i + 1)
        }

        return pageList
    }
    handleChange(e){
        this.setState(
            {
                [e.target.name]: e.target.value
            }
        )
    }
    componentDidUpdate(prevProps) {
        window.scrollTo(0, 0);

    }
    handleFormSubmit(e){
        e.preventDefault();
        this.props.history.push({
            pathname: '/search',
            search: `?q=${this.state.q}`,
        })
        this.setState({list: null})
    }
    changePage(e, page){
        e.preventDefault();

        this.props.history.push({
            pathname: '/search',
            search: `?q=${this.state.q}&page=${page}`,
        });
    }
    changeTarget(e, target){
        e.preventDefault();
        if(target === 'tanka'){
            this.props.history.push({
                pathname: '/search',
                search: `?q=${this.state.q}&target=tanka`,
            });
        }
        else if(target === 'koten'){
            this.props.history.push({
                pathname: '/search',
                search: `?q=${this.state.q}&target=koten`,
            });
        }
        else{
            this.props.history.push({
                pathname: '/search',
                search: `?q=${this.state.q}`,
            });
        }
    }
    render() {
        return (
            <div>
                <div className="uk-navbar-container uk-navbar-transparent" uk-navbar="true">
                    <div className="uk-navbar-left">
                        <Link className="uk-navbar-item uk-visible@s kaguya uk-text-bold uk-logo" to='/'>かぐや</Link>
                        <div className="uk-navbar-item">
                            <div className="uk-inline uk-box-shadow-hover-medium uk-visible@s">
                                <form name="searchForm" action="javascript:void(0)" onSubmit={this.handleFormSubmit} autoComplete="off">
                                    <a className="uk-form-icon uk-form-icon-flip" onClick={this.handleFormSubmit} uk-icon="icon: search"></a>
                                    <input className="uk-input uk-form-width-large" type="text" name="q" value={this.state.q} onChange={this.handleChange} />
                                </form>
                            </div>
                        </div>
                    </div>
                    
                    <div className="uk-navbar-center">
                        <Link className="uk-navbar-item uk-text-center uk-hidden@s uk-text-bold uk-logo" to='/'>かぐや</Link>
                    </div>

                    <div className="uk-navbar-right">
                        <ul className="uk-navbar-nav">
                            <li>
                                <a className="uk-navbar-toggle" uk-navbar-toggle-icon="true" href="#"></a>
                                <div className="uk-navbar-dropdown">
                                    <ul className="uk-nav uk-navbar-dropdown-nav">
                                        <li><Link to='/logout'>ログアウト</Link></li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="uk-flex uk-flex-column uk-hidden@s">
                    <form name="searchFormSmart" action="javascript:void(0)" onSubmit={this.handleFormSubmit} autoComplete="off">
                        <div className="uk-margin-left uk-margin-right">
                            <div className="uk-inline uk-box-shadow-hover-medium">
                                <a className="uk-form-icon uk-form-icon-flip" href="#" onClick={this.handleFormSubmit} uk-icon="icon: search"></a>
                                <input className="uk-input uk-form-width-large" type="text" name="q" value={this.state.q} onChange={this.handleChange} />
                            </div>
                        </div>
                    </form>
                </div>
                <ul className="uk-tab">

                    <li className="uk-margin-large-left" ><a onClick={e => this.changeTarget(e,　'tanka')}>俳諧</a></li>
                    <li><a onClick={e => this.changeTarget(e,　'tanka')}>短歌</a></li>
                    <li><a onClick={e => this.changeTarget(e,　'koten')}>古典</a></li>
                </ul>
                
                <div className="uk-flex uk-flex-column uk-width-1-1">
                    {(() => {
                        if (this.state.list) {
                            if (this.state.count > 0){
                                return (
                                    <div>
                                        <p className="uk-margin-large-left">{this.state.count} 件 {this.state.page}ページ目 ({(this.state.page - 1) * 50 + 1}～{(this.state.page - 1) * 50 + 50}件)</p>
                                        <div>{this.state.list}</div>
                                        <ul className="uk-pagination uk-flex-center">
                                            {this.state.paginationList}
                                        </ul>
                                    </div>);
                            }
                            else{
                                if (this.state.count !== null){
                                    return (
                                        <p className="uk-margin-large-left">{this.state.count} 件</p>                                    
                                    )
                                }
                            }
                        }
                        else{
                            return <div className="uk-text-center" uk-spinner="ratio: 4.5"></div>
                        }
                    })()}
                </div>
            </div>
        );
    }
}

export default withRouter(withAuth(Search));