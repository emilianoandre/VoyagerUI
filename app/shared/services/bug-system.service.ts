/**
 * Bug System Service
 * @author eandre
 */
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

//Shared
import { Constants } from '../utils/constants';
import { Utils } from '../utils/utils';

@Injectable()
export class BugSystemService {
    
    // Constants
    private SERVICE_USER = "BugSystem/";
    private METHOD_USER = "bugSystem";
    private METHOD_DELETE_USER = "deleteBugSystem";
    
    constructor(private http: Http) { }
    
    /**
     * Gets the list of bugSystems
     */
    getBugSystems() {        
        // Get Response        
        return this.http.get(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_USER + this.METHOD_USER, Utils.getJwt())
        .map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
    
    /**
     * Creates a bugSystem
     * @param bugSystem object to create
     */
    createBugSystem(bugSystem) {
        return this.http.post(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_USER + this.METHOD_USER, bugSystem, Utils.getJwt())
        .map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
    
    /**
     * Updates a bugSystem
     * @param updated bugSystem
     */
    updateBugSystem(bugSystem) {
        return this.http.put(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_USER + this.METHOD_USER,
                JSON.stringify(bugSystem), Utils.getJwt()).map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
    
    /**
     * Deletes a bug system
     * @param id of the bugSystem
     */
    deleteBugSystem(bugSystemId) {
        return this.http.put(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_USER + this.METHOD_DELETE_USER,
                bugSystemId, Utils.getJwt()).map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
}