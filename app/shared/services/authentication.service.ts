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
    private SERVICE_LOGOUT = "Login/";
    private METHOD_LOGOUT = "logout"
    
    constructor(private http: Http) { }
 
    login(userName, password) {
        return this.http.post(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_LOGIN + this.METHOD_LOGIN, JSON.stringify({ userName: userName, password: password }), Utils.getHeaders())
            .map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
 
    logout() {
        return this.http.post(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_LOGIN + this.METHOD_LOGOUT, localStorage.getItem('currentUser'), Utils.getHeaders())
        .map(Utils.handleServerResponse).catch(Utils.handleServerErrors);        
    }
}