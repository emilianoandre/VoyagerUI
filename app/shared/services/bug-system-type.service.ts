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
export class BugSystemTypeService {
    
    // Constants
    private SERVICE_TYPES = "BugSystemType/";
    private METHOD_BUG_SYSTEM_TYPE = "bugSystemType";
    private METHOD_DELETE_BUG_SYSTEM_TYPE = "deleteBugSystemType";
    
    constructor(private http: Http) { }
    
    /**
     * Gets the list of bugSystem types
     */
    getBugSystemTypes() {        
        // Get Response        
        return this.http.get(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_TYPES + this.METHOD_BUG_SYSTEM_TYPE, Utils.getJwt())
        .map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
    
    /**
     * Creates a bugSystem type from a name
     * @param name of the bugSystem type
     */
    createBugSystemType(name) {
        return this.http.post(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_TYPES + this.METHOD_BUG_SYSTEM_TYPE, name, Utils.getJwt())
        .map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
    
    /**
     * Updates a bugSystem type
     * @param updated bugSystem type
     */
    updateBugSystemType(bugSystemType) {
        return this.http.put(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_TYPES + this.METHOD_BUG_SYSTEM_TYPE,
                JSON.stringify(bugSystemType), Utils.getJwt()).map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
    
    /**
     * Deletes a bugSystem type
     */
    deleteBugSystemType(bugSystemTypeId) {
        return this.http.put(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_TYPES + this.METHOD_DELETE_BUG_SYSTEM_TYPE,
                bugSystemTypeId, Utils.getJwt()).map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
}