/**
 * User Service
 * @author eandre
 */
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

//Shared
import { Constants } from '../utils/constants';
import { Utils } from '../utils/utils';

@Injectable()
export class UserService {
    
    // Constants
    private SERVICE_USER = "User/";
    private METHOD_USER = "user";
    private METHOD_DELETE_USER = "deleteUser";
    
    constructor(private http: Http) { }
    
    /**
     * Gets the list of users
     */
    getUsers() {        
        // Get Response        
        return this.http.get(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_USER + this.METHOD_USER, Utils.getJwt())
        .map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
    
    /**
     * Creates a user
     * @param user object to create
     */
    createUser(user) {
        return this.http.post(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_USER + this.METHOD_USER, user, Utils.getJwt())
        .map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
    
    /**
     * Updates a user
     * @param updated user
     */
    updateUser(user) {
        return this.http.put(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_USER + this.METHOD_USER,
                JSON.stringify(user), Utils.getJwt()).map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
    
    /**
     * Deletes a
     * @param id of the
     */
    deleteUser(userId) {
        return this.http.put(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_USER + this.METHOD_DELETE_USER,
                userId, Utils.getJwt()).map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
}