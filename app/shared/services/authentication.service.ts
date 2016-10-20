/**
 * Shared Authentication Service
 * @author eandre
 */
import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

// Shared
import { Constants } from '../utils/constants';
import { Utils } from '../utils/utils';

@Injectable()
export class AuthenticationService {
    // Constants
    private SERVICE_LOGIN = "Login/";
    private METHOD_LOGIN = "login"
    
    constructor(private http: Http) { }
 
    login(userName, password) {
        return this.http.post(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_LOGIN + this.METHOD_LOGIN, JSON.stringify({ userName: userName, password: password }), Utils.getHeaders())
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
            }).catch(Utils.handleServerError);
    }
 
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}