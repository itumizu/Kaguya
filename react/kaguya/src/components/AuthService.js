import decode from 'jwt-decode';
export default class AuthService {
    constructor(domain) {
        this.domain = domain || 'http://localhost'
        this.fetch = this.fetch.bind(this)
        this.login = this.login.bind(this)
    }

    login(username, password) {
        return fetch(`${this.domain}/api/v1/auth/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        }).then(res => res.json())
        .then(res => {
            
            this.setToken(res)
            return Promise.resolve(res);
        })
    }

    loggedIn() {
        var token = this.getToken()
        var refreshToken = this.getRefreshToken()
        return !!token && !!refreshToken && !!this.isTokenVerified(token)
    }

    isTokenVerified(token) {
        var decoded = decode(token);
        let exp = decoded.exp;
        let nowTime = Math.round((new Date()).getTime() / 1000);
        console.log("NOW:", Math.round((new Date()).getTime() / 1000))
        console.log("EXP:", decoded.exp)

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
        // console.log("NOW"decoded)

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
            if (res){
                localStorage.setItem('accessToken', res.access)
                localStorage.setItem('refreshToken', token)
                return true
            }
            else{
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
    fetch(url, options, auth=false) {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        if(auth === false){
            if (this.loggedIn()) {
                headers['Authorization'] = 'Bearer ' + this.getToken()
            }
        }

        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json())
    }

    _checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }
}