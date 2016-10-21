/**
 * Types Service
 * @author eandre
 */
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

//Shared
import { Constants } from '../utils/constants';
import { Utils } from '../utils/utils';

@Injectable()
export class UserTypeService {
    
    // Constants
    private SERVICE_TYPES = "UserType/";
    private METHOD_USER_TYPE = "userType";
    private METHOD_DELETE_USER_TYPE = "deleteUserType";
    
    constructor(private http: Http) { }
    
    /**
     * Gets the list of user types
     */
    getUserTypes() {        
        // Get Response        
        return this.http.get(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_TYPES + this.METHOD_USER_TYPE, Utils.getJwt())
        .map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
    
    /**
     * Creates a user type from a name
     * @param name of the user type
     */
    createUserType(name) {
        return this.http.post(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_TYPES + this.METHOD_USER_TYPE, name, Utils.getJwt())
        .map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
    
    /**
     * Updates a user type
     * @param updated user type
     */
    updateUserType(userType) {
        return this.http.put(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_TYPES + this.METHOD_USER_TYPE,
                JSON.stringify(userType), Utils.getJwt()).map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
    
    /**
     * Deletes a user type
     * @param id of the user type
     */
    deleteUserType(userTypeId) {
        return this.http.put(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_TYPES + this.METHOD_DELETE_USER_TYPE,
                userTypeId, Utils.getJwt()).map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
}