import React, { Component } from 'react';
import ReactModal from "react-modal";
import { withRouter, Link } from 'react-router-dom';
import queryString from 'query-string';
import AsyncSelect from 'react-select/async';

import withAuth from '../withAuth'
import AuthService from './AuthService';
import '../css/style.sass';

class Search extends Component {
    constructor(props){
        super(props);

        var targets = ['haikai', 'tanka', 'koten']

        this.state = {
            q: "",
            target: "haikai",
            page: null,
            list: null,
            displayList: false,
            paginationList: null,
            count: null,
            
            // edit
            id: "",
            firstPart: "",
            secondPart: "",
            thirdPart: "",
            fourthPart: "",
            lastPart: "",
            firstPartKana: "",
            secondPartKana: "",
            thirdPartKana: "",
            fourthPartKana: "",
            lastPartKana: "",
            description: "",
            author: "",
            collection: "",
            year: "",
            text: "",
            number: "",
            modal: false,
            mode: "edit"
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleEditFormSubmit = this.handleEditFormSubmit.bind(this);
        this.getSelectAuthor = this.getSelectAuthor.bind(this);
        this.getSelectCollection = this.getSelectCollection.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

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

            if ('target' in q){
                if (q['target'] !== "" && targets.indexOf(q['target']) >= 0){
                    this.state['target'] = q['target']
                }
                else{
                    this.state['target'] = "haikai";
                }
            }
            else{
                this.state['target'] = "haikai";
            }

            if (this.state.q !== ""){
                this.search(this.state.q, this.state.target, this.state.page)
            }
            else{
                this.state["displayList"] = true
            }
        }

        props.history.listen((location, action) => {
            if (location.pathname !== "/edit"){
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
                    if ('target' in q){
                        if (q['target'] !== "" && targets.indexOf(q['target']) >= 0){
                            this.state['target'] = q['target']
                        }
                        else{
                            this.state['target'] = "haikai";
                        }
                    }
                    else{
                        this.state['target'] = "haikai";
                    }
                }
                if (this.state.q !== ""){
                    this.search(this.state.q, this.state.target, this.state.page)
                }
                else{
                    this.setState({
                        q: "",
                        page: null,
                        list: null,
                        paginationList: null,
                        count: null,
                        displayList: true
                    })
                }
            }
        })

        if (this.props.history.location.pathname === "/edit" && this.state.modal !== true){
            this.props.history.goBack()
        }
    }

    openModal() {
        this.setState({modal: true});
    }

    closeModal() {
        this.setState({
            modal: false,
            editData: null
        });
        this.props.history.goBack()
    }

    search(query, target, page=1){
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

        if (target === "tanka"){
            return this.Auth.get(`${this.Auth.domain}/api/v1/tanka/?query=${query}&offset=${offset}&limit=${limit}`)
            .then(res => {
                this.renderResult(res, target, page)
                return res
            })
        }
        else if (target === "koten"){
            return this.Auth.get(`${this.Auth.domain}/api/v1/koten/?query=${query}&offset=${offset}&limit=${limit}`)
            .then(res => {
                this.renderResult(res, target, page)
                return res
            })
        }
        else{
            return this.Auth.get(`${this.Auth.domain}/api/v1/haikai/?query=${query}&offset=${offset}&limit=${limit}`)
            .then(res => {
                this.renderResult(res, target, page)
                return res
            })
        }
    }

    renderResult(res, target, page){
        let list = []
        let paginationList = []
        let count = res.count;
        let paginations = this.pagination(page, Math.ceil(count / 50))
        
        if (target === "tanka"){
            for(var i in res.results){
                let result = res.results[i]

                list.push(
                    <div className="uk-card uk-card-default uk-card-body uk-align-center uk-margin-medium-left uk-margin-medium-right uk-margin-remove-adjacent" uk-grid="true">
                        {result.firstPart ? <p className="kaguya largeText">{result.firstPart}　{result.secondPart}　{result.thirdPart} {result.fourthPart} {result.lastPart} </p> : <p className="kaguya largeText">{result.firstPartKana}　{result.secondPartKana} {result.thirdPartKana} {result.fourthPartKana} {result.lastPartKana}</p>}
                        <div className="uk-align-center uk-align-right@s">
                            <div className="uk-grid-collapse" uk-grid="true">
                                {result.author && <a className="badgeText uk-margin-right" href="#" >{result.author.name}</a> }
                                {result.collection && <a className="badgeText uk-margin-right" href="#" >{result.collection.name}</a>}
                                {result.collection.parent && <a className="badgeText uk-margin-right" href="#" >{result.collection.parent.name}</a>}
                                <Link className="uk-text-break link" onClick={e => this.changeEdit(e,　result)}>
                                    <span className="uk-visible@s" uk-icon="icon: file-edit; ratio: 1.5"></span>
                                    <span className="uk-hidden@s" uk-icon="icon: file-edit; ratio: 1"></span>
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            }
        }
        
        else if (target === "koten"){
            for(var i in res.results){
                let result = res.results[i]
                list.push(
                    <div className="uk-card uk-card-default uk-card-body uk-align-center uk-margin-medium-left uk-margin-medium-right uk-margin-remove-adjacent" uk-grid="true">
                        <p className="kaguya largeText">{result.text}</p>
                        <div className="uk-align-center uk-align-right@s">
                            <div className="uk-grid-collapse" uk-grid="true">
                                {result.author && <a className="badgeText uk-margin-right" href="#" >{result.author.name}</a> }
                                {result.collection && <a className="badgeText uk-margin-right" href="#" >{result.collection.name}</a>}
                                {result.collection.parent && <a className="badgeText uk-margin-right" href="#" >{result.collection.parent.name}</a>}
                                <Link className="uk-text-break link" onClick={e => this.changeEdit(e,　result)}>
                                    <span className="uk-visible@s" uk-icon="icon: file-edit; ratio: 1.5"></span>
                                    <span className="uk-hidden@s" uk-icon="icon: file-edit; ratio: 1"></span>
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            }
        }
        else{
            for(var i in res.results){
                let result = res.results[i]
                list.push(
                    <div className="uk-card uk-card-default uk-card-body uk-align-center uk-margin-medium-left uk-margin-medium-right uk-margin-remove-adjacent" uk-grid="true">
                        {result.firstPart ? <p className="kaguya largeText">{result.firstPart}　{result.secondPart}　{result.lastPart}</p> : <p className="kaguya largeText">{result.firstPartKana}　{result.secondPartKana}　{result.lastPartKana}</p>}
                        <div className="uk-align-center uk-align-right@s">
                            <div className="uk-grid-collapse" uk-grid="true">
                                {result.author && <a className="badgeText uk-margin-right" href="#" >{result.author.name}</a> }
                                {result.collection && <a className="badgeText uk-margin-right" href="#" >{result.collection.name}</a>}
                                {result.collection.parent && <a className="badgeText uk-margin-right" href="#" >{result.collection.parent.name}</a>}
                                <Link className="uk-text-break link" onClick={e => this.changeEdit(e,　result)}>
                                    <span className="uk-visible@s" uk-icon="icon: file-edit; ratio: 1.5"></span>
                                    <span className="uk-hidden@s" uk-icon="icon: file-edit; ratio: 1"></span>
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            }
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
                if (target === "haikai"){
                    this.props.history.push({
                        pathname: '/search',
                        search: `?q=${this.state.q}&page=${Math.ceil(count / 50)}`,
                    })
                }
                else{
                    this.props.history.push({
                        pathname: '/search',
                        search: `?q=${this.state.q}&target=${this.state.target}&page=${Math.ceil(count / 50)}`,
                    })
                }
            }
            else if (count > 0 && page < 1){
                if (target === "haikai"){
                    this.props.history.push({
                        pathname: '/search',
                        search: `?q=${this.state.q}`,
                    })
                }
                else{
                    this.props.history.push({
                        pathname: '/search',
                        search: `?q=${this.state.q}&target=${this.state.target}`,
                    })
                }

            }
        }

        this.setState({
            list: list,
            paginationList: paginationList,
            count: count,
            page: page,
            displayList: true
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
    
    handleFormSubmit(e){
        e.preventDefault();

        if (this.state.target === "haikai"){
            this.props.history.push({
                pathname: '/search',
                search: `?q=${this.state.q}`,
            })
        }
        else{
            this.props.history.push({
                pathname: '/search',
                search: `?q=${this.state.q}&target=${this.state.target}`,
            })
        }

        this.setState({
            list: null,
            displayList: false
        })

    }

    handleEditFormSubmit(e){
        e.preventDefault();

        if (this.state.id !== null && this.state.id !== "" && this.state.id !== undefined){
            if (this.state.target === "haikai"){
                this.Auth.put(`${this.Auth.domain}/api/v1/haikai/${this.state.id}/`,{},  
                JSON.stringify({
                    "id": this.state.id,
                    "number": this.state.number,
                    "firstPart": this.state.firstPart,
                    "secondPart": this.state.secondPart,
                    "lastPart": this.state.lastPart,
                    "firstPartKana": this.state.firstPartKana,
                    "secondPartKana": this.state.secondPartKana,
                    "lastPartKana": this.state.lastPartKana,
                    "description": this.state.description,
                    "author": this.state.author.value,
                    "collection": this.state.collection.value,
                    "year": this.state.year.value
                }),
                ).then((response) => {
                    console.log(response)
                    this.closeModal();
                })
                .catch((error) => {
                    console.log(error)
                })
            }
            else if(this.state.target === "tanka"){
                this.Auth.put(`${this.Auth.domain}/api/v1/tanka/${this.state.id}/`,{},  
                    JSON.stringify({
                        "id": this.state.id,
                        "number": this.state.number,
                        "firstPart": this.state.firstPart,
                        "secondPart": this.state.secondPart,
                        "thirdPart": this.state.thirdPart,
                        "fourthPart": this.state.fourthPart,
                        "lastPart": this.state.lastPart,
                        "firstPartKana": this.state.firstPartKana,
                        "secondPartKana": this.state.secondPartKana,
                        "thirdPartKana": this.state.thirdPartKana,
                        "fourthPartKana": this.state.fourthPartKana,
                        "lastPartKana": this.state.lastPartKana,
                        "description": this.state.description,
                        "author": this.state.author.value,
                        "collection": this.state.collection.value,
                        "year": this.state.year.value
                    }),
                ).then((response) => {
                    console.log(response)
                    this.closeModal();
                })
                .catch((error) => {
                    console.log(error)
                })
            }
            else{
                this.Auth.put(`${this.Auth.domain}/api/v1/koten/${this.state.id}/`,{},  
                    JSON.stringify({
                        "id": this.state.id,
                        "number": this.state.number,
                        "text": this.state.text,
                        "description": this.state.description,
                        "author": this.state.author.value,
                        "collection": this.state.collection.value,
                        "year": this.state.year.value
                    }),
                ).then((response) => {
                    console.log(response)
                    this.closeModal();
                })
                .catch((error) => {
                    console.log(error)
                })
            }
        }
        else{
            if (this.state.target === "haikai"){
                this.Auth.post(`${this.Auth.domain}/api/v1/haikai/`,{},  
                JSON.stringify({
                    "number": this.state.number,
                    "firstPart": this.state.firstPart,
                    "secondPart": this.state.secondPart,
                    "lastPart": this.state.lastPart,
                    "firstPartKana": this.state.firstPartKana,
                    "secondPartKana": this.state.secondPartKana,
                    "lastPartKana": this.state.lastPartKana,
                    "description": this.state.description,
                    "author": this.state.author.value,
                    "collection": this.state.collection.value,
                    "year": this.state.year.value
                }),
                ).then((response) => {
                    console.log(response)
                    this.closeModal();
                })
                .catch((error) => {
                    console.log(error)
                })
            }
            else if(this.state.target === "tanka"){
                this.Auth.post(`${this.Auth.domain}/api/v1/tanka/`,{},  
                    JSON.stringify({
                        "number": this.state.number,
                        "firstPart": this.state.firstPart,
                        "secondPart": this.state.secondPart,
                        "thirdPart": this.state.thirdPart,
                        "fourthPart": this.state.fourthPart,
                        "lastPart": this.state.lastPart,
                        "firstPartKana": this.state.firstPartKana,
                        "secondPartKana": this.state.secondPartKana,
                        "thirdPartKana": this.state.thirdPartKana,
                        "fourthPartKana": this.state.fourthPartKana,
                        "lastPartKana": this.state.lastPartKana,
                        "description": this.state.description,
                        "author": this.state.author.value,
                        "collection": this.state.collection.value,
                        "year": this.state.year.value
                    }),
                ).then((response) => {
                    console.log(response)
                    this.closeModal();
                })
                .catch((error) => {
                    console.log(error)
                })
            }
            else{
                this.Auth.post(`${this.Auth.domain}/api/v1/koten/`,{},  
                    JSON.stringify({
                        "number": this.state.number,
                        "text": this.state.text,
                        "description": this.state.description,
                        "author": this.state.author.value,
                        "collection": this.state.collection.value,
                        "year": this.state.year.value
                    }),
                ).then((response) => {
                    console.log(response)
                    this.closeModal();
                })
                .catch((error) => {
                    console.log(error)
                })
            }            
        }
    }

    changePage(e, page){
        e.preventDefault();
        this.setState({
            displayList: false
        })
        if (this.state.target === "haikai"){
            this.props.history.push({
                pathname: '/search',
                search: `?q=${this.state.q}&page=${page}`,
            });
        }
        else{
            this.props.history.push({
                pathname: '/search',
                search: `?q=${this.state.q}&target=${this.state.target}&page=${page}`,
            });            
        }

        window.scrollTo(0, 0);
    }

    changeTarget(e, target){
        e.preventDefault();
        
        this.setState({
            list: null,
            paginationList: null,
            count: null,
            displayList: false,
            target: target
        })

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

        window.scrollTo(0, 0);
    }

    changeEdit(e, props){
        e.preventDefault();

        this.props.history.push({
            pathname: '/edit',
        })
        
        this.setState({
            id: props.id,
            firstPart: props.firstPart,
            secondPart: props.secondPart,
            thirdPart: props.thirdPart,
            fourthPart: props.fourthPart,
            lastPart: props.lastPart,
            firstPartKana: props.firstPartKana,
            secondPartKana: props.secondPartKana,
            thirdPartKana: props.thirdPartKana,
            fourthPartKana: props.fourthPartKana,
            lastPartKana: props.lastPartKana,
            description: props.description,
            author: 
            {
                value: props.author.id,
                label: props.author.name
            },
            collection: {
                value: props.collection.id,
                label: props.collection.name
            },
            text: props.text,
            number: props.number,
            mode: "edit"
        })

        this.openModal()
    }

    changeCreate(e){
        e.preventDefault();

        this.props.history.push({
            pathname: '/edit',
        })
        
        this.setState({
            id: "",
            firstPart: "",
            secondPart: "",
            thirdPart: "",
            fourthPart: "",
            lastPart: "",
            firstPartKana: "",
            secondPartKana: "",
            thirdPartKana: "",
            fourthPartKana: "",
            lastPartKana: "",
            description: "",
            author: 
            {
                value: null,
                label: null
            },
            collection: {
                value: null,
                label: null
            },
            text: "",
            number: 1,
            mode: "create"
        })

        this.openModal()
    }

    getSelectCollection(input){
        if (!input) {
            return Promise.resolve({ options: [] });
        }
        return this.Auth.get(`${this.Auth.domain}/api/v1/collection?query=${input}`)
        .then((response) => {
            console.log(response)
            let options = response.results.map( collection => ({ value: collection.id, label: collection.name }));
            return options
        })
        .catch((e) => {
            console.log(e);
            return Promise.resolve({ options: [] });
        });
    }

    getSelectAuthor(input){
        if (!input) {
            return Promise.resolve({ options: [] });
        }

        return this.Auth.get(`${this.Auth.domain}/api/v1/author?query=${input}`)
        .then((response) => {
            console.log(response)
            let options = response.results.map( author => ({ value: author.id, label: author.name }));
            return options
        })
        .catch((e) => {
            console.log(e);
            return Promise.resolve({ options: [] });
        });
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
                        
                        <div className="uk-navbar-item uk-flex">
                            <div className="uk-inline uk-box-shadow-hover-medium uk-visible@m">
                                <form name="searchForm" action="javascript:void(0)" onSubmit={this.handleFormSubmit} autoComplete="off">
                                    <a className="uk-form-icon uk-form-icon-flip" onClick={this.handleFormSubmit} uk-icon="icon: search"></a>
                                    <input className="uk-input uk-form-width-large" type="text" name="q" value={this.state.q} onChange={this.handleChange} />
                                </form>
                            </div>
                        </div>
                    </div>
                    
                    <div className="uk-navbar-right">
                        <div className="uk-inline uk-visible@s">
                            <div class="uk-grid-small uk-child-width-expand@s uk-form-stacked" uk-grid="true">
                                <div>
                                    <button class="uk-align-right uk-button uk-button-default uk-text-center" onClick={e => this.changeCreate(e)} >追加</button>
                                </div>
                            </div>
                        </div>
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
                <div className="uk-hidden@m">
                    <form name="searchFormSmart" className="" action="javascript:void(0)" onSubmit={this.handleFormSubmit} autoComplete="off">
                        <div className="uk-margin-left uk-margin-right uk-flex uk-flex-center">
                            <div className="uk-inline uk-box-shadow-hover-medium">
                                <a className="uk-form-icon uk-form-icon-flip" href="#" onClick={this.handleFormSubmit} uk-icon="icon: search"></a>
                                <input className="uk-input uk-form-width-large" type="text" name="q" value={this.state.q} onChange={this.handleChange} />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="uk-hidden@m uk-margin-top uk-margin-left uk-margin-right">
                    {(() => 
                        {
                            if (this.state.target === "koten"){
                                return (
                                    <ul class="uk-child-width-expand" uk-tab="true">
                                        <li><a onClick={e => this.changeTarget(e,　'haikai')}>俳諧</a></li>
                                        <li><a onClick={e => this.changeTarget(e,　'tanka')}>短歌</a></li>
                                        <li className="uk-active"><a onClick={e => this.changeTarget(e,　'koten')}>古典</a></li>
                                    </ul>
                                )
                            }
                            else if (this.state.target === "tanka"){
                                return (
                                    <ul class="uk-child-width-expand" uk-tab="true">
                                        <li><a onClick={e => this.changeTarget(e,　'haikai')}>俳諧</a></li>
                                        <li className="uk-active"><a onClick={e => this.changeTarget(e,　'tanka')}>短歌</a></li>
                                        <li><a onClick={e => this.changeTarget(e,　'koten')}>古典</a></li>
                                    </ul>
                                )                                    
                            }
                            else{
                                return (
                                    <ul class="uk-child-width-expand" uk-tab="true">
                                        <li className="uk-active"><a onClick={e => this.changeTarget(e,　'haikai')}>俳諧</a></li>
                                        <li><a onClick={e => this.changeTarget(e,　'tanka')}>短歌</a></li>
                                        <li><a onClick={e => this.changeTarget(e,　'koten')}>古典</a></li>
                                    </ul>
                                )                                    
                            }
                        }
                    )()}
                </div>
                <div className="uk-visible@m">
                    {(() => 
                        {
                            if (this.state.target === "koten"){
                                return (
                                    <ul uk-tab="true">
                                        <li className="uk-margin-large-left"><a onClick={e => this.changeTarget(e,　'haikai')}>俳諧</a></li>
                                        <li><a onClick={e => this.changeTarget(e,　'tanka')}>短歌</a></li>
                                        <li className="uk-active"><a onClick={e => this.changeTarget(e,　'koten')}>古典</a></li>
                                    </ul>
                                )
                            }
                            else if (this.state.target === "tanka"){
                                return (
                                    <ul uk-tab="true">
                                        <li className="uk-margin-large-left"><a onClick={e => this.changeTarget(e,　'haikai')}>俳諧</a></li>
                                        <li className="uk-active"><a onClick={e => this.changeTarget(e,　'tanka')}>短歌</a></li>
                                        <li><a onClick={e => this.changeTarget(e,　'koten')}>古典</a></li>
                                    </ul>
                                )                             
                            }
                            else{
                                return (
                                    <ul uk-tab="true">
                                        <li className="uk-active uk-margin-large-left"><a onClick={e => this.changeTarget(e,　'haikai')}>俳諧</a></li>
                                        <li><a onClick={e => this.changeTarget(e,　'tanka')}>短歌</a></li>
                                        <li><a onClick={e => this.changeTarget(e,　'koten')}>古典</a></li>
                                    </ul>
                                )                            
                            }
                        }
                    )()}
                </div>

                <div className="uk-flex uk-flex-column uk-width-1-1">
                    {(() => {
                        if (this.state.displayList) {
                            if (this.state.count > 0){
                                return (
                                    <div>
                                        <div class="uk-clearfix uk-display-inline">
                                            <div class="uk-float-left uk-margin-large-left">
                                                <p className="">{this.state.count} 件 {this.state.page}ページ目 ({(this.state.page - 1) * 50 + 1}～{(this.state.page - 1) * 50 + 50}件)</p>
                                            </div>
                                            <div class="uk-float-right uk-margin-large-right@s uk-margin-small-right uk-hidden@s">
                                                <button className="uk-button uk-button-default"　onClick={e => this.changeCreate(e)}>追加</button>
                                            </div>
                                        </div>
                                        <div>{this.state.list}</div>
                                        <ul className="uk-pagination uk-flex-center">
                                            {this.state.paginationList}
                                        </ul>
                                    </div>);
                            }
                            else{
                                if (this.state.count !== null){
                                    return (
                                        <div>
                                            <div class="uk-clearfix uk-display-inline">
                                                <div class="uk-float-left uk-margin-large-left">
                                                    <p className="">{this.state.count} 件</p>
                                                </div>
                                                <div class="uk-float-right uk-margin-large-right@s uk-margin-small-right uk-hidden@s">
                                                    <button className="uk-button uk-button-default"　onClick={e => this.changeCreate(e)}>追加</button>
                                                </div>
                                            </div>
                                        </div>                   
                                    )
                                }
                            }
                        }
                        else{
                            return <div className="uk-text-center" uk-spinner="ratio: 4.5"></div>
                        }
                    })()}
                </div>

                <ReactModal 
                    isOpen={this.state.modal}
                    contentLabel="onRequestClose Example"
                    onRequestClose={this.closeModal}
                    className="Modal"
                    overlayClassName="Overlay"
                >
                    <div class="uk-card">
                        <div class="uk-card-header uk-margin-remove-bottom	">
                            <button class="uk-close-large" type="button" uk-close="true" onClick={this.closeModal}></button>
                        </div>
                        <div class="uk-card-body uk-padding-remove-top">
                            <fieldset class="uk-fieldset">
                                <div class="uk-margin">
                                    {(() =>
                                        {
                                            if(this.state.mode === "create"){
                                                return <legend class="uk-legend">新規追加</legend>
                                            }
                                            else{
                                                return <legend class="uk-legend">編集</legend>
                                            }
                                        }
                                    )()}
                                </div>                                
                                <form name="editForm" action="javascript:void(0)" onSubmit={this.handleEditFormSubmit}>
                                    {(() => {
                                        if (this.state.target === "koten"){
                                            return (
                                                <div>
                                                    <div class="uk-margin">
                                                        <label class="uk-form-label" for="form-stacked-text">本文</label>
                                                        <div class="uk-grid-small uk-child-width-expand@s uk-form-stacked" uk-grid="true">
                                                            <div class="uk-width-1-1@s">
                                                                <textarea class="uk-textarea" rows="10" placeholder="" name="text" autoComplete="off" value={this.state.text} onChange={this.handleChange}></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        else if (this.state.target === "tanka"){
                                            return (
                                            <div>
                                                <div class="uk-margin">    
                                                <label class="uk-form-label" for="form-stacked-text">漢字</label>
                                                    <div class="uk-grid-small uk-child-width-expand@s uk-form-stacked" uk-grid="true">
                                                        <div class="uk-width-1-3@s">
                                                            <input className="uk-input" type="text" placeholder="上の句" name="firstPart" autoComplete="off" value={this.state.firstPart} onChange={this.handleChange} />
                                                        </div>
                                                        <div class="uk-width-1-3@s">
                                                            <input class="uk-input" type="text" placeholder="中の句" name="secondPart" autoComplete="off" value={this.state.secondPart} onChange={this.handleChange}/>
                                                        </div>
                                                        <div class="uk-width-1-3@s">
                                                            <input class="uk-input" type="text" placeholder="下の句" name="thirdPart" autoComplete="off" value={this.state.thirdPart} onChange={this.handleChange}/>
                                                        </div>
                                                        <div class="uk-width-1-3@s">
                                                            <input class="uk-input" type="text" placeholder="中の句" name="fourthPart" autoComplete="off" value={this.state.fourthPart} onChange={this.handleChange}/>
                                                        </div>
                                                        <div class="uk-width-1-3@s">
                                                            <input class="uk-input" type="text" placeholder="下の句" name="lastPart" autoComplete="off" value={this.state.lastPart} onChange={this.handleChange}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="uk-margin">
                                                    <label class="uk-form-label" for="form-stacked-text">かな</label>
                                                    <div class="uk-grid-small uk-child-width-expand@s uk-form-stacked" uk-grid="true">
                                                        <div class="uk-width-1-3@s">
                                                            <input class="uk-input" type="text" placeholder="一の句 (かな)" name="firstPartKana" autoComplete="off" value={this.state.firstPartKana} onChange={this.handleChange}/>
                                                        </div>
                                                        <div class="uk-width-1-3@s">
                                                            <input class="uk-input" type="text" placeholder="二の句 (かな)" name="secondPartKana" autoComplete="off" value={this.state.secondPartKana} onChange={this.handleChange}/>
                                                        </div>
                                                        <div class="uk-width-1-3@s">
                                                            <input class="uk-input" type="text" placeholder="三の句 (かな)" name="thirdPartKana" autoComplete="off" value={this.state.thirdPartKana} onChange={this.handleChange}/>
                                                        </div>
                                                        <div class="uk-width-1-3@s">
                                                            <input class="uk-input" type="text" placeholder="四の句 (かな)" name="fourthPartKana" autoComplete="off" value={this.state.fourthPartKana} onChange={this.handleChange}/>
                                                        </div>
                                                        <div class="uk-width-1-3@s">
                                                            <input class="uk-input" type="text" placeholder="五の句 (かな)" name="lastPartKana" autoComplete="off" value={this.state.lastPartKana} onChange={this.handleChange}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            )
                                        }
                                        else{
                                            return (
                                            <div>
                                                <div class="uk-margin">    
                                                <label class="uk-form-label" for="form-stacked-text">漢字</label>
                                                    <div class="uk-grid-small uk-child-width-expand@s uk-form-stacked" uk-grid="true">
                                                        <div class="uk-width-1-3@s">
                                                            <input className="uk-input" type="text" placeholder="上の句" name="firstPart" autoComplete="off" value={this.state.firstPart} onChange={this.handleChange} />
                                                        </div>
                                                        <div class="uk-width-1-3@s">
                                                            <input class="uk-input" type="text" placeholder="中の句" name="secondPart" autoComplete="off" value={this.state.secondPart} onChange={this.handleChange}/>
                                                        </div>
                                                        <div class="uk-width-1-3@s">
                                                            <input class="uk-input" type="text" placeholder="下の句" name="lastPart" autoComplete="off" value={this.state.lastPart} onChange={this.handleChange}/>
                                                        </div>
                                                    
                                                    </div>
                                                </div>
                                                <div class="uk-margin">
                                                    <label class="uk-form-label" for="form-stacked-text">かな</label>
                                                    <div class="uk-grid-small uk-child-width-expand@s uk-form-stacked" uk-grid="true">
                                                        <div class="uk-width-1-3@s">
                                                            <input class="uk-input" type="text" placeholder="上の句 (かな)" name="firstPartKana" autoComplete="off" value={this.state.firstPartKana} onChange={this.handleChange}/>
                                                        </div>
                                                        <div class="uk-width-1-3@s">
                                                            <input class="uk-input" type="text" placeholder="中の句 (かな)" name="secondPartKana" autoComplete="off" value={this.state.secondPartKana} onChange={this.handleChange}/>
                                                        </div>
                                                        <div class="uk-width-1-3@s">
                                                            <input class="uk-input" type="text" placeholder="下の句 (かな)" name="lastPartKana" autoComplete="off" value={this.state.lastPartKana} onChange={this.handleChange}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            )
                                        }
                                    })()}
                                    <div class="uk-margin">
                                        <label class="uk-form-label" for="form-stacked-text">説明</label>
                                        <div class="uk-grid-small uk-child-width-expand@s uk-form-stacked" uk-grid="true">
                                            <div class="uk-width-1-1@s">
                                                <textarea class="uk-textarea" rows="5" placeholder="" name="description" autoComplete="off" value={this.state.description} onChange={this.handleChange}></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="uk-margin">
                                        <label class="uk-form-label" for="form-stacked-text">所属作品</label>
                                        <div class="uk-grid-small uk-child-width-expand@s uk-form-stacked" uk-grid="true">
                                            <div>
                                            <AsyncSelect
                                                    value={this.state.collection}
                                                    onChange={e => {
                                                        this.setState({
                                                            collection: {
                                                                label: e.label,
                                                                value: e.value
                                                            }
                                                        });
                                                    }}
                                                    loadingMessage ={() => "検索中です..."}
                                                    noOptionsMessage={() => "結果が見つかりませんでした"}
                                                    loadOptions={this.getSelectCollection}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="uk-margin">
                                        <label class="uk-form-label" for="form-stacked-text">作者</label>
                                        <div class="uk-grid-small uk-child-width-expand@s uk-form-stacked" uk-grid="true">
                                            <div>
                                                <AsyncSelect
                                                    value={this.state.author}
                                                    onChange={e => {
                                                        this.setState({
                                                            author: {
                                                                label: e.label,
                                                                value: e.value
                                                            }
                                                        });
                                                    }}
                                                    loadingMessage ={() => "検索中です..."}
                                                    noOptionsMessage={() => "結果が見つかりませんでした"}
                                                    loadOptions={this.getSelectAuthor}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="uk-margin">                                                                          
                                        {(() => 
                                            {
                                                if(this.state.mode === "create"){
                                                    if (this.state.target !== "koten"){
                                                        return (
                                                            <div>
                                                                <label class="uk-form-label" for="form-stacked-text">番号</label>
                                                                <div class="uk-grid-small uk-child-width-expand@s uk-form-stacked" uk-grid="true">
                                                                    <div class="uk-width-1-3@s">
                                                                        <input class="uk-input" type="number" placeholder="" name="number" autoComplete="off" value={this.state.number} onChange={this.handleChange}/>
                                                                    </div>
                                                                    <div>
                                                                        <button class="uk-align-right uk-button uk-button-default uk-text-center">追加する</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                    else{
                                                        return (
                                                            <button class="uk-align-right uk-button uk-button-default uk-text-center">追加する</button>
                                                        )                                                        
                                                    }
                                                    
                                                }
                                                else{
                                                    if (this.state.target !== "koten"){
                                                        return (
                                                            <div>
                                                                <label class="uk-form-label" for="form-stacked-text">番号</label>
                                                                <div class="uk-grid-small uk-child-width-expand@s uk-form-stacked" uk-grid="true">
                                                                    <div class="uk-width-1-3@s">
                                                                        <input class="uk-input" type="number" placeholder="" name="number" autoComplete="off" value={this.state.number} onChange={this.handleChange}/>
                                                                    </div>
                                                                    <div>
                                                                         <button class="uk-align-right uk-button uk-button-default uk-text-center">更新する</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                    else{
                                                        return (
                                                            <button class="uk-align-right uk-button uk-button-default uk-text-center">更新する</button>
                                                        )                                                        
                                                    }
                                                }
                                            }
                                        )()}                                        
                                    </div>
                                </form>
                            </fieldset>
                        </div>
                    </div>
                </ReactModal>
            </div> 
        );
    }
}

export default withRouter(withAuth(Search));