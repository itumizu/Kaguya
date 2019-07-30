import decode from 'jwt-decode';
import axios from 'axios';

export default class AuthService {
    constructor(domain) {
        this.domain = domain || 'http://localhost'
        this.post = this.post.bind(this)
        this.login = this.login.bind(this)
    }

    login(username, password) {
        return axios.post(`${this.domain}/api/v1/auth/`, 
            JSON.stringify({
                username,
                password
            }),
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }
        )
        .then(res => {
            // console.log(res)
            this.setToken(res.data)
            return Promise.resolve(res);
        })
        .catch((error) => {
            console.log(error)
        });
    }

    loggedIn() {
        var token = this.getToken()
        var refreshToken = this.getRefreshToken()
        return !!token && !!refreshToken && !!this.isTokenVerified(token)
    }

    isTokenVerified(token) {
        if (token === undefined){
            if (this.refreshToken(this.getRefreshToken())){
                token = this.getToken()
            }
            else{
                return false
            }
        }

        var decoded = decode(token);
        let exp = decoded.exp;
        let nowTime = Math.round((new Date()).getTime() / 1000);

        if (exp > nowTime && Math.abs(exp - nowTime) <= 60){
            console.log("更新が近いから更新するよ")
            let refreshToken = this.getRefreshToken()
            if (refreshToken === undefined || refreshToken === null){
                return false;
            }
            else{
                if (this.refreshToken(refreshToken)){
                    // return true;
                }
                else{     
                    return false
                }
            }
        }

        return fetch(`${this.domain}/api/v1/auth/verify/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token
            })
        }).catch({

        })
        .then(res => {
            if (res.ok){
                return true;
            }
            else{
                let refreshToken = this.getRefreshToken()
                if (refreshToken === undefined || refreshToken === null){
                    return false;
                }
                else{
                    if (this.refreshToken(refreshToken)){
                        return true;
                    }
                    else{     
                        return false
                    }
                }
            }
        })
    }

    setToken(res) {    
        localStorage.setItem('accessToken', res.access)
        localStorage.setItem('refreshToken', res.refresh)
    }

    refreshToken(token){        
        return fetch(`${this.domain}/api/v1/auth/refresh/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refresh: token
            })
        })
        .then(res => res.json())
        .then(res => {
            if (res.ok){
                localStorage.setItem('accessToken', res.access)
                localStorage.setItem('refreshToken', token)
                return true
            }
            else{
                localStorage.removeItem('refreshToken');        
                localStorage.removeItem('accessToken');
                return false
            }

        })
    }

    getToken() {
        return localStorage.getItem('accessToken');
    }

    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    }

    logout() {
        localStorage.removeItem('refreshToken');        
        localStorage.removeItem('accessToken');
        return true
    }

    getProfile() {
        return decode(this.getToken());
    }

    post(url, options, data, auth=false) {
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        if(auth === false){
            if (this.loggedIn()) {
                headers['Authorization'] = 'Bearer ' + this.getToken()
            }
        }

        return axios.post(url, data, {
            headers,
            ...options
        })
        .then((response) => {
            console.log(response)
            return response.data
        })
        .catch((e) => {
            console.log(e)
            throw e
        })
    }
    put(url, options, data, auth=false) {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        if(auth === false){
            if (this.loggedIn()) {
                headers['Authorization'] = 'Bearer ' + this.getToken()
            }
        }

        return axios.put(url, data, {
            headers,
            ...options
        })
        .then((response) => {
            console.log(response)
            return response.data
        })
        .catch((e) => {
            console.log(e)
            throw e
        })
    }
    get(url, options, data, auth=false) {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        if(auth === false){
            if (this.loggedIn()) {
                headers['Authorization'] = 'Bearer ' + this.getToken()
            }
        }

        return axios.get(url, {
            headers,
            ...options
        }, data)
        .then((response) => {
            console.log(response)
            return response.data
        })
        .catch((e) => {
            console.log(e)
            throw e
        })
    }
}