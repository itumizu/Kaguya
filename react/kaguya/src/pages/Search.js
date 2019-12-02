import React, { Component } from 'react';
import ReactModal from "react-modal";
import ReactMarkdown from "react-markdown";
import { withRouter, Link } from 'react-router-dom';
import queryString from 'query-string';
import AsyncSelect from 'react-select/async';
import moment from "moment";

import withAuth from '../withAuth'
import AuthService from '../components/AuthService';
import '../css/style.sass';

class Search extends Component {
    constructor(props){
        super(props);

        this.state = {
            targets: ['haikai', 'tanka', 'koten'],
            targetName: ["俳諧", '短歌', "古典"],
            q: "",
            query: "",
            target: "haikai",
            targetCollection: null,
            targetAuthor: null,
            displayCollection: "",
            displayAuthor: "",
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
            mode: "edit",

            newCollection: "",
            newCollectionParent: "",
            newCollectionDescription: "",
            newAuthor: "",
            newAuthorDescription: ""
        };
        
        this.search = this.search.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleEditFormSubmit = this.handleEditFormSubmit.bind(this);
        this.handleNewCollectionFormSubmit = this.handleNewCollectionFormSubmit.bind(this);
        this.handleNewAuthorFormSubmit = this.handleNewAuthorFormSubmit.bind(this);
        this.getSelectAuthor = this.getSelectAuthor.bind(this);
        this.getSelectCollection = this.getSelectCollection.bind(this);
        this.changeSearchCriteria = this.changeSearchCriteria.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.Auth = new AuthService();

        if (props.history.location.search){
            let q = queryString.parse(props.history.location.search)
            if ('q' in q){
                this.state.q = q['q']
                this.state.query = q['q']

                if ('page' in q && !isNaN(q['page'])){
                    this.state.page = q['page']
                }
                else{
                    this.state.page = 1;
                }
            }

            if ('target' in q){
                if (q['target'] !== "" && this.state.targets.indexOf(q['target']) >= 0){
                    this.state.target = q['target']
                }
                else{
                    this.state.target = "haikai";
                }
            }
            else{
                this.state.target = "haikai";
            }

            if ('collection' in q){
                this.state.targetCollection = q.collection
                this.getCollectionInfo(q.collection)
            }
            else{
                this.state.targetCollection = null
                this.state.displayCollection = ""
            }

            if ('author' in q){
                this.state.targetAuthor = q.author;
                this.getAuthorInfo(q.author)
            }
            else{
                this.state.targetAuthor = null
                this.state.displayAuthor= ""
            }

            if (this.state.q !== ""){
                this.search(this.state.q, this.state.target, this.state.page)
            }
            else{
                if (q.author !== "" || q.collection !== "" || q.author !== null || q.collection !== null){
                    this.search(this.state.q, this.state.target, this.state.page)
                    this.state.displayList = true
                }
                else{
                    this.state.displayList = false
                }
            }
        }

        props.history.listen((location, action) => {
            if (action === 'POP'){
                if (location.pathname !== "/edit"){
                    if (location.search){
                        let q = queryString.parse(location.search)
                        if ('q' in q){
                            this.state.q = q['q']
                            this.state.query = q['q']

                            if ('page' in q && !isNaN(q['page'])){
                                this.state.page = q['page']
                            }
                            else{
                                this.state.page = 1;
                            }
                        }
                        if ('target' in q){
                            if (q['target'] !== "" && this.state.targets.indexOf(q['target']) >= 0){
                                this.state.target = q['target']
                            }
                            else{
                                this.state.target = "haikai";
                            }
                        }
                        else{
                            this.state.target = "haikai";
                        }

                        if ('collection' in q){
                            this.state.targetCollection = q.collection
                            this.getCollectionInfo(q.collection)
                        }
                        else{
                            this.state.targetCollection = null
                            this.state.displayCollection = ""
                        }
            
                        if ('author' in q){
                            this.state.targetAuthor = q.author;
                            this.getAuthorInfo(q.author)
                        }
                        else{
                            this.state.targetAuthor = null
                            this.state.displayAuthor = ""
                        }

                        if (this.state.q !== ""){
                            this.search(this.state.q, this.state.target, this.state.page)
                        }
                        else{
                            if (q.author !== "" || q.collection !== "" || q.author !== null || q.collection !== null){
                                this.search(this.state.q, this.state.target, this.state.page, null, "replace")
                            }
                            else{
                                // this.state.displayList = true
    
                                this.setState({
                                    q: "",
                                    query: "",
                                    page: null,
                                    list: null,
                                    paginationList: null,
                                    count: null,
                                    displayList: true
                                })
                            }
                        }
                    }
                }
            }
        })

        document.title = this.state.q + "(" + this.state.targetName[this.state.targets.indexOf(this.state.target)] + ") - かぐや";
    }

    search(query, target, page=1, criteriaData=null, mode){
        let criteriaCheck = false
        let offset = (page - 1) * 50
        let limit = 50

        if(isNaN(page)){
            page = 1
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
       
        let requestURL = `${this.Auth.domain}/api/v1/${target}/?query=${query}&offset=${offset}&limit=${limit}`

        if (criteriaData === null){
            if (this.state.targetCollection){
                requestURL += `&collection=${this.state.targetCollection}`
                criteriaCheck = true
            }
            if (this.state.targetAuthor){
                requestURL += `&author=${this.state.targetAuthor}`
                criteriaCheck = true
            }
        }
        else{
            if (criteriaData.target === "collection"){
                requestURL += `&collection=${criteriaData.id}`
                if (query !== "" || criteriaData.id !== ""){
                    criteriaCheck = true
                }
            }
            else{
                requestURL += `&author=${criteriaData.id}`
                
                if (query !== "" || criteriaData.id !== ""){
                    criteriaCheck = true
                }
            }
        }
        
        if (!query.match(/\S/g)){
            // 空ならば何もしない。

            if (criteriaCheck){
                return this.Auth.get(requestURL)
                .then(res => {
                    // console.log(res)
                    this.renderResult(res, target, page)
                    return res
                })
            }
            else{
                this.setState({
                    q: "",
                    query: "",
                    page: null,
                    list: null,
                    paginationList: null,
                    count: null,
                    displayList: true
                })
            }
        }
        else{
            return this.Auth.get(requestURL)
            .then(res => {
                // console.log(res)
                this.renderResult(res, target, page)
                return res
            })
        }
    }
    removeCriteria(e, criteria){
        let criteriaData = {}

        if (criteria === "author"){
            this.setState({
                page: 1,
                targetAuthor: null,
                displayAuthor: "",
                displayList: false
            })

            if (this.state.targetCollection){
                criteriaData.target = "collection"
                criteriaData.id = this.state.targetCollection
            }
            else{
                criteriaData.target = "collection"
                criteriaData.id = ""
            }

            this.pushURL(this.state.q, this.state.target, 1, this.state.targetCollection, null)
        }
        else{
            if (this.state.targetAuthor){
                criteriaData.target = "author"
                criteriaData.id = this.state.targetAuthor
            }
            else{
                criteriaData.target = "collection"
                criteriaData.id = ""
            }

            this.setState({
                page: 1,
                targetCollection: null,
                displayCollection: "",
                displayList: false
            })

            this.pushURL(this.state.q, this.state.target, 1, null, this.state.targetAuthor)
        }

        if (this.state.q){
            this.search(this.state.q, this.state.target, 1, criteriaData)
        }
        else{
            this.search(this.state.q, this.state.target, 1, criteriaData)
        }
    }

    changeSearchCriteria(e, criteria, data){
        let criteriaData = {
            target: criteria,
            id: data.id   
        }

        if (criteria === "author"){
            this.setState({
                page: 1,
                targetAuthor: data.id,
                displayAuthor: data.name,
                targetCollection: null,
                displayCollection: "",
                displayList: false
            })

            this.pushURL(this.state.q, this.state.target, 1, null, data.id)
        }
        else{
            this.setState({
                page: 1,
                targetAuthor: null,
                displayAuthor: "",
                targetCollection: data.id,
                displayCollection: data.name,
                displayList: false
            })

            this.pushURL(this.state.q, this.state.target, 1, data.id, null)
        }

        this.search(this.state.q, this.state.target, 1, criteriaData)
    }

    renderResult(res, target, page){
        let list = []
        let paginationList = []
        let count = res.count;
        let paginations = this.pagination(page, Math.ceil(count / 50))
        
        if (target === "tanka"){
            for(let i in res.results){
                let result = res.results[i]

                list.push(
                    <div className="uk-card uk-card-default uk-card-body uk-align-center uk-margin-medium-left uk-margin-medium-right uk-margin-remove-adjacent" uk-grid="true">
                        {result.firstPart ? <p className="kaguya largeText uk-padding-remove-left">{result.firstPart}　{result.secondPart}　{result.thirdPart} {result.fourthPart} {result.lastPart} </p> : <p className="kaguya largeText uk-padding-remove-left">{result.firstPartKana}　{result.secondPartKana} {result.thirdPartKana} {result.fourthPartKana} {result.lastPartKana}</p>}
                        <ul className="uk-margin-remove" uk-accordion="true">
                            <li>
                                <a className="uk-accordion-title uk-margin-remove"></a>
                                <div className="uk-accordion-content">
                                    {result.firstPart ? <p className="kaguya uk-padding-remove-left">{result.firstPartKana}　{result.secondPartKana}　{result.thirdPartKana} {result.fourthPartKana} {result.lastPartKana} </p> : <p className="kaguya uk-padding-remove-left">{result.firstPart}　{result.secondPart} {result.thirdPart} {result.fourthPart} {result.lastPart}</p>}

                                    <ReactMarkdown
                                        source={result.description}
                                    ></ReactMarkdown>
                                    <div className="uk-align-right">
                                        <button className="uk-align-right uk-button uk-button-default uk-text-center uk-margin-remove" onClick={e => this.changeEdit(e,　result)} >
                                            <span className="uk-margin-small-right" uk-icon="icon: file-edit; ratio: 1.0">
                                            </span>
                                            編集
                                        </button>
                                        <br/>
                                        <p>
                                            番号: {result.number}<br/>
                                            更新日時: {moment(result.updated_at).format('YYYY/MM/DD HH:mm:ss')}<br/>
                                            作成日時: {moment(result.created_at).format('YYYY/MM/DD HH:mm:ss')}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div className="uk-align-center uk-align-right@s">
                            <div className="uk-grid-collapse" uk-grid="true">
                                {result.author && <a className="badgeText uk-margin-right" onClick={e => this.changeSearchCriteria(e,　"author", result.author)}  >{result.author.name}</a> }
                                {result.collection && <a className="badgeText uk-margin-right" onClick={e => this.changeSearchCriteria(e,　"collection", result.collection)} >{result.collection.name}</a>}
                                {result.collection.parent && <a className="badgeText uk-margin-right" onClick={e => this.changeSearchCriteria(e,　"collection", result.collection.parent)} >{result.collection.parent.name}</a>}
                            </div>
                        </div>
                    </div>
                );
            }
        }
        
        else if (target === "koten"){
            for(let i in res.results){
                let result = res.results[i]

                list.push(
                    <div className="uk-card uk-card-default uk-card-body uk-align-center uk-margin-medium-left uk-margin-medium-right uk-margin-remove-adjacent" uk-grid="true">
                        <div className="kaguya largeText uk-padding-remove-left">
                            <ReactMarkdown
                                source={result.text}
                            ></ReactMarkdown>
                        </div>
                        <ul className="uk-margin-remove" uk-accordion="true">
                            <li>
                                <a className="uk-accordion-title uk-margin-remove"></a>
                                <div className="uk-accordion-content">
                                    <ReactMarkdown
                                        source={result.description}
                                    ></ReactMarkdown>
                                    <div className="uk-align-right">
                                        <button className="uk-align-right uk-button uk-button-default uk-text-center uk-margin-remove" onClick={e => this.changeEdit(e,　result)} >
                                            <span className="uk-margin-small-right" uk-icon="icon: file-edit; ratio: 1.0">
                                            </span>
                                            編集
                                        </button>
                                        <br/>
                                        <p>
                                            更新日時: {moment(result.updated_at).format('YYYY/MM/DD HH:mm:ss')}<br/>
                                            作成日時: {moment(result.created_at).format('YYYY/MM/DD HH:mm:ss')}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div className="uk-align-center uk-align-right@s">
                            <div className="uk-grid-collapse" uk-grid="true">
                            {result.author && <a className="badgeText uk-margin-right" onClick={e => this.changeSearchCriteria(e,　"author", result.author)}  >{result.author.name}</a> }
                                {result.collection && <a className="badgeText uk-margin-right" onClick={e => this.changeSearchCriteria(e,　"collection", result.collection)} >{result.collection.name}</a>}
                                {result.collection.parent && <a className="badgeText uk-margin-right" onClick={e => this.changeSearchCriteria(e,　"collection", result.collection.parent)} >{result.collection.parent.name}</a>}
                            </div>
                        </div>
                    </div>
                );
            }
        }
        else{
            for(let i in res.results){
                let result = res.results[i]
                list.push(
                    <div key={i} className="uk-card uk-card-default uk-card-body uk-align-center uk-margin-medium-left uk-margin-medium-right uk-margin-remove-adjacent" uk-grid="true">
                        {result.firstPart ? <p className="kaguya largeText uk-padding-remove-left">{result.firstPart}　{result.secondPart}　{result.lastPart}</p> : <p className="kaguya largeText uk-padding-remove-left">{result.firstPartKana}　{result.secondPartKana}　{result.lastPartKana}</p>}
                        <ul className="uk-margin-remove" uk-accordion="true">
                            <li>
                                <a className="uk-accordion-title uk-margin-remove"></a>
                                <div className="uk-accordion-content">
                                    {result.firstPart ? <p className="kaguya uk-padding-remove-left">{result.firstPartKana}　{result.secondPartKana}　{result.lastPartKana}</p> : <p className="kaguya uk-padding-remove-left">{result.firstPart}　{result.secondPart}　{result.lastPart}</p>}

                                    <ReactMarkdown
                                        source={result.description}
                                    ></ReactMarkdown>

                                    <div className="uk-align-right">
                                        <button className="uk-align-right uk-button uk-button-default uk-text-center uk-margin-remove" onClick={e => this.changeEdit(e,　result)} >
                                            <span className="uk-margin-small-right" uk-icon="icon: file-edit; ratio: 1.0">
                                            </span>
                                            編集
                                        </button>
                                        <br/>
                                        <p>
                                            番号: {result.number}<br/>
                                            更新日時: {moment(result.updated_at).format('YYYY/MM/DD HH:mm:ss')}<br/>
                                            作成日時: {moment(result.created_at).format('YYYY/MM/DD HH:mm:ss')}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div className="uk-align-center uk-align-right@s">
                            <div className="uk-grid-collapse" uk-grid="true">
                                {result.author && <a className="badgeText uk-margin-right" onClick={e => this.changeSearchCriteria(e,　"author", result.author)}  >{result.author.name}</a> }
                                {result.collection && <a className="badgeText uk-margin-right" onClick={e => this.changeSearchCriteria(e,　"collection", result.collection)} >{result.collection.name}</a>}
                                {result.collection.parent && <a className="badgeText uk-margin-right" onClick={e => this.changeSearchCriteria(e,　"collection", result.collection.parent)} >{result.collection.parent.name}</a>}
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
                    <li key={1}>
                        <a className="page-link" onClick={e => this.changePage(e,　1)}>{1}</a>
                    </li>
                )
                paginationList.push(
                    <li key={2}>
                        <a className="page-link" onClick={e => this.changePage(e,　paginations[0])}>&lt;</a>
                    </li>
                )
            }
            for (let n in paginations){
                n = paginations[n]
                paginationList.push(
                    <li key={paginationList.length}>
                        <a className="page-link" onClick={e => this.changePage(e,　n)}>{n}</a>
                    </li>
                );
            }
            if (page !== Math.ceil(count / 50)){
                paginationList.push(
                    <li key={paginationList.length}>
                        <a className="page-link" onClick={e => this.changePage(e,　paginations[-1])}>&gt;</a>
                    </li>
                )
                paginationList.push(
                    <li key={paginationList.length}>
                        <a className="page-link" onClick={e => this.changePage(e,　Math.ceil(count / 50))}>{Math.ceil(count / 50)}</a>
                    </li>
                )
            }
        }
        else{
                        
        }

        //かぐや様は告らせたい
        if (this.state.q === "かぐや様は告らせたい"){
            list = []
            count = 1
            list.push(
                <div key={1} className="uk-card uk-card-default uk-card-body uk-align-center uk-margin-medium-left uk-margin-medium-right uk-margin-remove-adjacent" uk-grid="true">
                    <p className="kaguya largeText uk-padding-remove-left">かぐや様は告らせたい〜天才たちの恋愛頭脳戦〜</p>
                    <div className="uk-align-center uk-align-right@s">
                        <div className="uk-grid-collapse" uk-grid="true">
                            <a className="badgeText uk-margin-right" href="https://twitter.com/akasaka_aka?lang=ja">赤坂アカ</a>
                            <a className="badgeText uk-margin-right" href="https://twitter.com/824_aoi?lang=ja">古賀葵</a>
                            <a className="badgeText uk-margin-right" href="https://kaguya.love/" >アニメ公式サイト</a>
                            <a className="badgeText uk-margin-right" href="https://kaguya.love/1st/" >アニメ一期公式サイト</a>
                            <a className="badgeText uk-margin-right" href="https://youngjump.jp/kaguyasama/" >漫画公式サイト</a>
                            <a className="badgeText uk-margin-right" href="https://kaguyasama-movie.com/" >映画公式サイト</a>
                        </div>
                    </div>
                </div>
            )

            this.setState({
                list: list,
                paginationList: paginationList,
                count: count,
                page: page,
                displayList: true,
                targetAuthor: null,
                targetCollection: null,
                displayAuthor: "",
                displayCollection: ""
            })

        }
        //かぐや様は告らせたい
        else{
            this.setState({
                list: list,
                paginationList: paginationList,
                count: count,
                page: page,
                displayList: true
            })
        }
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

            for (let i of Array(endIndex - startIndex).keys()){
                pageList.push(i + startIndex)
            }

            return pageList.slice(0, (2 * 3 + 1));
        }

        for (let i of Array(pageLength).keys()){
            pageList.push(i + 1)
        }

        return pageList
    }

    openModal() {
        this.setState({modal: true});
    }

    closeModal() {
        this.setState({
            modal: false,
            editData: null
        });
        this.pushURL(this.state.q, this.state.target, this.state.page, this.state.targetCollection, this.state.targetAuthor, true)
    }
    
    pushURL(q, target=null, page=1, collection=null, author=null, replace=false){
        let requestURL = `?q=${q}`

        if (target === "haikai"){
            // 俳諧は何もしません
        }
        else{
            requestURL += `&target=${target}`
        }

        if (collection){
            requestURL += `&collection=${collection}`
        }

        if (author){
            requestURL += `&author=${author}`
        }

        if (page > 1){
            requestURL += `&page=${page}`
        }

        if (replace){
            this.props.history.replace({
                pathname: '/search',
                search: requestURL
            })
        }
        else{
            this.props.history.push({
                pathname: '/search',
                search: requestURL
            })
        }

        this.setState({
            q: q,
            query: q
        })

        document.title = q + "(" + this.state.targetName[this.state.targets.indexOf(target)] + ") - かぐや";
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
        if (!this.state.q.match(/\S/g)){
            // 空ならば何もしない。
            if (this.state.targetAuthor || this.state.targetCollection){
                this.setState({
                    page: 1,
                    list: null,
                    displayList: false
                })
                this.search(this.state.q, this.state.target, this.state.page)
                this.pushURL(this.state.q, this.state.target, this.state.page, this.state.targetCollection, this.state.targetAuthor)
            }
            else{
                this.setState({
                    displayList: true
                })
            }
        }
        else{
            this.setState({
                page: 1,
                list: null,
                displayList: false
            })
            this.search(this.state.q, this.state.target, this.state.page)
            this.pushURL(this.state.q, this.state.target, this.state.page, this.state.targetCollection, this.state.targetAuthor)
        }
    }

    handleNewCollectionFormSubmit(e){
        e.preventDefault();

        this.Auth.post(`${this.Auth.domain}/api/v1/collection/`,{},  
            JSON.stringify({
                name: this.state.newCollection,
                descrption: this.state.newCollectionDescrption,
                parent: this.state.newCollectionParent.value
            }),
            ).then((response) => {
                // console.log(response)

                this.setState({
                    collection: {
                        label: response.name,
                        value: response.id
                    }
                })

            })
            .catch((error) => {
                console.log(error)
            }
        )
    }
    handleNewAuthorFormSubmit(e){
        e.preventDefault();

        this.Auth.post(`${this.Auth.domain}/api/v1/author/`,{},  
            JSON.stringify({
                name: this.state.newAuthor,
                descrption: this.state.newAuthorDescrption,
            }),
            ).then((response) => {
                // console.log(response)
                this.setState({
                    author: {
                        label: response.name,
                        value: response.id
                    }
                })
            })
            .catch((error) => {
                console.log(error)
            }
        )
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
                    // console.log(response)
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
                    // console.log(response)
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
                    // console.log(response)
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
                    // console.log(response)
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
                    // console.log(response)
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
                    // console.log(response)
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

        this.search(this.state.q, this.state.target, page)
        this.pushURL(this.state.q, this.state.target, page, this.state.targetCollection, this.state.targetAuthor, false)
        
        this.setState({
            page: page,
            displayList: false
        })

        window.scrollTo(0, 0);
    }

    changeTarget(e, target){
        e.preventDefault();
        
        this.setState({
            list: null,
            count: null,
            page: 1,
            paginationList: null,
            displayList: false,
            target: target,
            targetAuthor: null,
            targetCollection: null,
            displayAuthor: "",
            displayCollection: ""
        })

        this.search(this.state.query, target, this.state.page)
        this.pushURL(this.state.query, target, 1)

        window.scrollTo(0, 0);
    }

    changeEdit(e, props){
        e.preventDefault();

        let authorData = {
            label: "なし",
            value: null
        }
        let collectionData = {
            label: "なし",
            value: null
        }

        this.props.history.push({
            pathname: '/edit',
        })
        
        if (props.author !== null){
            authorData.value = props.author.id
            authorData.label = props.author.name
        }

        if (props.collection.parent){
            collectionData.value = props.collection.id
            collectionData.label = props.collection.name + " (" + props.collection.parent.name + ")"
        }
        else{
            collectionData.value = props.collection.id
            collectionData.label = props.collection.name
        }
        
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
            author: authorData,
            collection: collectionData,
            newCollection: "",
            newCollectionParent: {
                label: "なし",
                value: null
            },
            newCollectionDescription: "",
            newAuthor: "",
            newAuthorDescription: "",
            text: props.text,
            number: props.number,
            mode: "edit",
        })

        this.openModal()
    }

    changeCreate(e){
        e.preventDefault();
        
        this.props.history.replace({
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
                label: "なし"
            },
            collection: {
                value: null,
                label: "なし"
            },
            newCollection: "",
            newCollectionParent: {
                label: "なし",
                value: null
            },
            newCollectionDescription: "",
            newAuthor: "",
            newAuthorDescription: "",
            text: "",
            number: 1,
            mode: "create"
        })

        this.openModal()
    }

    getAuthorInfo(authorId){
        return this.Auth.get(`${this.Auth.domain}/api/v1/author/${authorId}`)
        .then((response) => {
            this.setState({
                displayAuthor: response.name
            })

            return response.name
        })
        .catch((e) => {
            console.log(e);
            return Promise.resolve({ options: [] });
        });
    }

    getCollectionInfo(collectionId){
        return this.Auth.get(`${this.Auth.domain}/api/v1/collection/${collectionId}`)
        .then((response) => {
            let name = response.name

            if (response.parent){
                name = response.parent.name + " (" + name + ")" 
            }

            this.setState({
                displayCollection: name
            })

            return response.name
        })
        .catch((e) => {
            console.log(e);
            return Promise.resolve({ options: [] });
        });
    }

    getSelectCollection(input){
        if (!input) {
            return Promise.resolve({ options: [] });
        }

        return this.Auth.get(`${this.Auth.domain}/api/v1/collection?query=${input}`)
        .then((response) => {
            let options = []

            if (response.count > 0){
                options.push({value: "", label: "なし"})
            }

            options = options.concat(response.results.map(
                collection => 
                {
                    if (collection.parent){
                        return { value: collection.id, label: collection.name + " (" + collection.parent.name + ")"};
                    }
                    else{
                        return { value: collection.id, label: collection.name};
                    }
                }));

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
            let options = []
            
            if (response.count > 0){
                options.push({value: "", label: "なし"})
            }
            
            options = options.concat(response.results.map( author => ({ value: author.id, label: author.name })));
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
                                <form name="searchForm" onSubmit={this.handleFormSubmit} autoComplete="off">
                                    <a className="uk-form-icon uk-form-icon-flip" onClick={this.handleFormSubmit} uk-icon="icon: search"></a>
                                    <input className="uk-input uk-form-width-large" type="text" name="q" value={this.state.q} onChange={this.handleChange} />
                                </form>
                            </div>
                        </div>
                    </div>
                    
                    <div className="uk-navbar-right">
                        <div className="uk-inline uk-visible@s">
                            <div className="uk-grid-small uk-child-width-expand@s uk-form-stacked" uk-grid="true">
                                <div>
                                    <button className="uk-align-right uk-button uk-button-default uk-text-center" onClick={e => this.changeCreate(e)} >追加</button>
                                </div>
                            </div>
                        </div>
                        <ul className="uk-navbar-nav">
                            <li>
                                <a className="uk-navbar-toggle" uk-navbar-toggle-icon="true"></a>
                                <div className="uk-navbar-dropdown">
                                    <ul className="uk-nav uk-navbar-dropdown-nav">
                                        <li><Link to='/notice'>お知らせ</Link></li>
                                        <li><Link to='/logout'>ログアウト</Link></li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="uk-hidden@m">
                    <form name="searchFormSmart" className="" onSubmit={this.handleFormSubmit} autoComplete="off">
                        <div className="uk-margin-left uk-margin-right uk-flex uk-flex-center">
                            <div className="uk-inline uk-box-shadow-hover-medium">
                                <a className="uk-form-icon uk-form-icon-flip" onClick={this.handleFormSubmit} uk-icon="icon: search"></a>
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
                                    <ul className="uk-child-width-expand" uk-tab="true">
                                        <li><a onClick={e => this.changeTarget(e,　'haikai')}>俳諧</a></li>
                                        <li><a onClick={e => this.changeTarget(e,　'tanka')}>短歌</a></li>
                                        <li className="uk-active"><a onClick={e => this.changeTarget(e,　'koten')}>古典</a></li>
                                    </ul>
                                )
                            }
                            else if (this.state.target === "tanka"){
                                return (
                                    <ul className="uk-child-width-expand" uk-tab="true">
                                        <li><a onClick={e => this.changeTarget(e,　'haikai')}>俳諧</a></li>
                                        <li className="uk-active"><a onClick={e => this.changeTarget(e,　'tanka')}>短歌</a></li>
                                        <li><a onClick={e => this.changeTarget(e,　'koten')}>古典</a></li>
                                    </ul>
                                )                                    
                            }
                            else{
                                return (
                                    <ul className="uk-child-width-expand" uk-tab="true">
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
                                        <div className="uk-clearfix uk-display-inline">
                                            <div className="uk-float-left uk-margin-large-left uk-margin-large-right">
                                                <p className="">
                                                    {this.state.count} 件 {this.state.page}ページ目 ({(this.state.page - 1) * 50 + 1}～{(this.state.page - 1) * 50 + 50}件)
                                                    {this.state.displayCollection && <br/>}
                                                    {this.state.displayCollection && "検索対象(作品): " + this.state.displayCollection}
                                                    {this.state.displayCollection && <a className="uk-margin-small-left" onClick={e => this.removeCriteria(e,　"collection")}>解除</a> }
                                                    {this.state.displayAuthor && <br/>}
                                                    {this.state.displayAuthor && "検索対象(作者): " + this.state.displayAuthor}
                                                    {this.state.displayAuthor && <a className="uk-margin-small-left" onClick={e => this.removeCriteria(e,　"author")}>解除</a> }

                                                </p>
                                            </div>
                                            <div className="uk-float-right uk-margin-large-right uk-margin-small-bottom uk-margin-small-right uk-hidden@s">
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
                                            <div className="uk-clearfix uk-display-inline">
                                                <div className="uk-float-left uk-margin-large-left">
                                                    <p className="">
                                                        {this.state.count} 件
                                                        {this.state.displayCollection && <br/>}
                                                        {this.state.displayCollection && "検索対象(作品): " + this.state.displayCollection}
                                                        {this.state.displayCollection && <a className="uk-margin-small-left" onClick={e => this.removeCriteria(e,　"collection")}>解除</a> }
                                                        {this.state.displayAuthor && <br/>}
                                                        {this.state.displayAuthor && "検索対象(作者): " + this.state.displayAuthor}
                                                        {this.state.displayAuthor && <a className="uk-margin-small-left" onClick={e => this.removeCriteria(e,　"author")}>解除</a> }
                                                    </p>
                                                </div>
                                                <div className="uk-float-right uk-margin-large-right@s uk-margin-small-right uk-hidden@s">
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
                    onRequestClose={this.closeModal}
                    className="Modal"
                    overlayClassName="Overlay"
                >
                    <div className="uk-card">
                        <div className="uk-card-header uk-margin-remove-bottom	">
                            <button className="uk-close-large" type="button" uk-close="true" onClick={this.closeModal}></button>
                        </div>
                        <div className="uk-card-body uk-padding-remove-top">
                            <fieldset className="uk-fieldset">
                                <div className="uk-margin">
                                    {(() =>
                                        {
                                            if(this.state.mode === "create"){
                                                return <legend className="uk-legend">新規追加</legend>
                                            }
                                            else{
                                                return <legend className="uk-legend">編集</legend>
                                            }
                                        }
                                    )()}
                                </div>                                
                                <form name="editForm" onSubmit={this.handleEditFormSubmit}>
                                    {(() => {
                                        if (this.state.target === "koten"){
                                            return (
                                                <div>
                                                    <div className="uk-margin">
                                                        <label className="uk-form-label" for="form-stacked-text">本文(Markdown記法を使用できます)</label>
                                                        <div className="uk-grid-small uk-child-width-expand@s uk-form-stacked" uk-grid="true">
                                                            <div className="uk-width-1-1@s">
                                                                <textarea className="uk-textarea" rows="10" placeholder="" name="text" autoComplete="off" value={this.state.text} onChange={this.handleChange}></textarea>
                                                            </div>
                                                        </div>
                                                        <ul className="uk-margin-left uk-margin-right" uk-accordion="true">
                                                            <li>
                                                                <a className="uk-accordion-title"></a>
                                                                <div className="uk-accordion-content">
                                                                <p>プレビュー</p>
                                                                    <hr/>
                                                                    <ReactMarkdown
                                                                        source={this.state.text}
                                                                    ></ReactMarkdown>
                                                                    <hr/>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        else if (this.state.target === "tanka"){
                                            return (
                                            <div>
                                                <div className="uk-margin">    
                                                <label className="uk-form-label" for="form-stacked-text">漢字</label>
                                                    <div className="uk-grid-small uk-child-width-expand@s uk-form-stacked" uk-grid="true">
                                                        <div className="uk-width-1-3@s">
                                                            <input className="uk-input" type="text" placeholder="上の句" name="firstPart" autoComplete="off" value={this.state.firstPart} onChange={this.handleChange} />
                                                        </div>
                                                        <div className="uk-width-1-3@s">
                                                            <input className="uk-input" type="text" placeholder="中の句" name="secondPart" autoComplete="off" value={this.state.secondPart} onChange={this.handleChange}/>
                                                        </div>
                                                        <div className="uk-width-1-3@s">
                                                            <input className="uk-input" type="text" placeholder="下の句" name="thirdPart" autoComplete="off" value={this.state.thirdPart} onChange={this.handleChange}/>
                                                        </div>
                                                        <div className="uk-width-1-3@s">
                                                            <input className="uk-input" type="text" placeholder="中の句" name="fourthPart" autoComplete="off" value={this.state.fourthPart} onChange={this.handleChange}/>
                                                        </div>
                                                        <div className="uk-width-1-3@s">
                                                            <input className="uk-input" type="text" placeholder="下の句" name="lastPart" autoComplete="off" value={this.state.lastPart} onChange={this.handleChange}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="uk-margin">
                                                    <label className="uk-form-label" for="form-stacked-text">かな</label>
                                                    <div className="uk-grid-small uk-child-width-expand@s uk-form-stacked" uk-grid="true">
                                                        <div className="uk-width-1-3@s">
                                                            <input className="uk-input" type="text" placeholder="一の句 (かな)" name="firstPartKana" autoComplete="off" value={this.state.firstPartKana} onChange={this.handleChange}/>
                                                        </div>
                                                        <div className="uk-width-1-3@s">
                                                            <input className="uk-input" type="text" placeholder="二の句 (かな)" name="secondPartKana" autoComplete="off" value={this.state.secondPartKana} onChange={this.handleChange}/>
                                                        </div>
                                                        <div className="uk-width-1-3@s">
                                                            <input className="uk-input" type="text" placeholder="三の句 (かな)" name="thirdPartKana" autoComplete="off" value={this.state.thirdPartKana} onChange={this.handleChange}/>
                                                        </div>
                                                        <div className="uk-width-1-3@s">
                                                            <input className="uk-input" type="text" placeholder="四の句 (かな)" name="fourthPartKana" autoComplete="off" value={this.state.fourthPartKana} onChange={this.handleChange}/>
                                                        </div>
                                                        <div className="uk-width-1-3@s">
                                                            <input className="uk-input" type="text" placeholder="五の句 (かな)" name="lastPartKana" autoComplete="off" value={this.state.lastPartKana} onChange={this.handleChange}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            )
                                        }
                                        else{
                                            return (
                                            <div>
                                                <div className="uk-margin">    
                                                <label className="uk-form-label" for="form-stacked-text">漢字</label>
                                                    <div className="uk-grid-small uk-child-width-expand@s uk-form-stacked" uk-grid="true">
                                                        <div className="uk-width-1-3@s">
                                                            <input className="uk-input" type="text" placeholder="上の句" name="firstPart" autoComplete="off" value={this.state.firstPart} onChange={this.handleChange} />
                                                        </div>
                                                        <div className="uk-width-1-3@s">
                                                            <input className="uk-input" type="text" placeholder="中の句" name="secondPart" autoComplete="off" value={this.state.secondPart} onChange={this.handleChange}/>
                                                        </div>
                                                        <div className="uk-width-1-3@s">
                                                            <input className="uk-input" type="text" placeholder="下の句" name="lastPart" autoComplete="off" value={this.state.lastPart} onChange={this.handleChange}/>
                                                        </div>
                                                    
                                                    </div>
                                                </div>
                                                <div className="uk-margin">
                                                    <label className="uk-form-label" for="form-stacked-text">かな</label>
                                                    <div className="uk-grid-small uk-child-width-expand@s uk-form-stacked" uk-grid="true">
                                                        <div className="uk-width-1-3@s">
                                                            <input className="uk-input" type="text" placeholder="上の句 (かな)" name="firstPartKana" autoComplete="off" value={this.state.firstPartKana} onChange={this.handleChange}/>
                                                        </div>
                                                        <div className="uk-width-1-3@s">
                                                            <input className="uk-input" type="text" placeholder="中の句 (かな)" name="secondPartKana" autoComplete="off" value={this.state.secondPartKana} onChange={this.handleChange}/>
                                                        </div>
                                                        <div className="uk-width-1-3@s">
                                                            <input className="uk-input" type="text" placeholder="下の句 (かな)" name="lastPartKana" autoComplete="off" value={this.state.lastPartKana} onChange={this.handleChange}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            )
                                        }
                                    })()}

                                    <div className="uk-margin">
                                        <label className="uk-form-label" for="form-stacked-text">説明(Markdown記法を使用できます)</label>
                                        <div className="uk-grid-small uk-child-width-expand@s uk-form-stacked" uk-grid="true">
                                            <div className="uk-width-1-1@s">
                                                <textarea className="uk-textarea" rows="5" placeholder="" name="description" autoComplete="off" value={this.state.description} onChange={this.handleChange}></textarea>
                                            </div>
                                        </div>
                                        <ul className="uk-margin-remove" uk-accordion="true">
                                            <li className="uk-margin-left uk-margin-right">
                                                <a className="uk-accordion-title"></a>
                                                <div className="uk-accordion-content">
                                                    <p>プレビュー</p>
                                                    <hr/>
                                                    <ReactMarkdown
                                                        source={this.state.description}
                                                    ></ReactMarkdown>
                                                    <hr/>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="uk-margin">
                                        <label className="uk-form-label" for="form-stacked-text">所蔵作品</label>
                                        <div className="uk-grid-small uk-child-width-expand@s uk-form-stacked" uk-grid="true">
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
                                        <ul className="uk-margin-remove" uk-accordion="true">
                                            <li className="uk-margin-left uk-margin-right">
                                                <a className="uk-accordion-title"></a>
                                                <div className="uk-accordion-content">
                                                    <hr/>
                                                    <p>新規所蔵作品の追加</p>
                                                    
                                                    <div className="uk-grid-small uk-child-width-expand@s uk-form-stacked" uk-grid="true">
                                                        <div className="uk-width-1-2@s">
                                                            <label className="uk-form-label" for="form-stacked-text">作品名</label>
                                                            <input className="uk-input" type="text" placeholder="作品名" name="newCollection" autoComplete="off" value={this.state.newCollection} onChange={this.handleChange} />
                                                        </div>

                                                        <div className="uk-width-1-2@s">
                                                            <label className="uk-form-label" for="form-stacked-text">親作品</label>
                                                            <AsyncSelect
                                                                value={this.state.newCollectionParent}
                                                                onChange={e => {
                                                                    this.setState({
                                                                        newCollectionParent: {
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

                                                        <div className="uk-width-1-1@s">
                                                            <button className="uk-align-right uk-button uk-button-default uk-text-center" onClick={this.handleNewCollectionFormSubmit}>追加する</button>
                                                        </div>

                                                    </div>
                                                    <hr/>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="uk-margin">
                                        <label className="uk-form-label" for="form-stacked-text">作者</label>
                                        <div className="uk-grid-small uk-child-width-expand@s uk-form-stacked" uk-grid="true">
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
                                        <ul className="uk-margin-remove" uk-accordion="true">
                                            <li className="uk-margin-left uk-margin-right">
                                                <a className="uk-accordion-title"></a>
                                                <div className="uk-accordion-content">
                                                    <hr/>
                                                    <p>新規作者の追加</p>
                                                    <div className="uk-grid-small uk-child-width-expand@s uk-form-stacked" uk-grid="true">
                                                        <div className="uk-width-1-2@s">
                                                            <label className="uk-form-label" for="form-stacked-text">作者名</label>
                                                            <input className="uk-input" type="text" placeholder="作者名" name="newAuthor" autoComplete="off" value={this.state.newAuthor} onChange={this.handleChange} />
                                                        </div>
                                                        <div className="uk-width-1-2@s">
                                                            <button className="uk-align-right uk-button uk-button-default uk-text-center" onClick={this.handleNewAuthorFormSubmit}>追加する</button>
                                                        </div>
                                                    </div>
                                                    <hr/>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="uk-margin">                                                                          
                                        {(() => 
                                            {
                                                if(this.state.mode === "create"){
                                                    if (this.state.target !== "koten"){
                                                        return (
                                                            <div>
                                                                <label className="uk-form-label" for="form-stacked-text">番号</label>
                                                                <div className="uk-grid-small uk-child-width-expand@s uk-form-stacked" uk-grid="true">
                                                                    <div className="uk-width-1-3@s">
                                                                        <input className="uk-input" type="number" placeholder="" name="number" autoComplete="off" min="1" value={this.state.number} onChange={this.handleChange}/>
                                                                    </div>
                                                                    <div>
                                                                        <button className="uk-align-right uk-button uk-button-default uk-text-center">追加する</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                    else{
                                                        return (
                                                            <button className="uk-align-right uk-button uk-button-default uk-text-center">追加する</button>
                                                        )                                                        
                                                    }
                                                    
                                                }
                                                else{
                                                    if (this.state.target !== "koten"){
                                                        return (
                                                            <div>
                                                                <label className="uk-form-label" for="form-stacked-text">番号</label>
                                                                <div className="uk-grid-small uk-child-width-expand@s uk-form-stacked" uk-grid="true">
                                                                    <div className="uk-width-1-3@s">
                                                                        <input className="uk-input" type="number" placeholder="" name="number" autoComplete="off" value={this.state.number} onChange={this.handleChange}/>
                                                                    </div>
                                                                    <div>
                                                                         <button className="uk-align-right uk-button uk-button-default uk-text-center">更新する</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                    else{
                                                        return (
                                                            <button className="uk-align-right uk-button uk-button-default uk-text-center">更新する</button>
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