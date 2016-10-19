/**
 * Shared Authentication Service
 * @author eandre
 */
import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { Constants } from '../utils/constants';

@Injectable()
export class AuthenticationService {
    // Constants
    private SERVICE_LOGIN = "Login/";
    private METHOD_LOGIN = "login"
    
    constructor(private http: Http) { }
 
    login(userName, password) {
        
        // Define headers
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        return this.http.post(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_LOGIN + this.METHOD_LOGIN, JSON.stringify({ userName: userName, password: password }), options)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
            });
    }
 
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}