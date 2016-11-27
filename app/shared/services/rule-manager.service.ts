/**
 * Rule Manager Service
 * @author eandre
 */
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

//Shared
import { Constants } from '../utils/constants';
import { Utils } from '../utils/utils';

@Injectable()
export class RuleManagerService {
    
    // Constants
    private SERVICE_USER = "RuleManager/";
    private METHOD_USER = "ruleManager";
    private METHOD_DELETE_USER = "deleteRuleManager";
    
    constructor(private http: Http) { }
    
    /**
     * Gets the list of ruleManagers
     */
    getRuleManagers() {        
        // Get Response        
        return this.http.get(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_USER + this.METHOD_USER, Utils.getJwt())
        .map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
    
    /**
     * Creates a ruleManager
     * @param ruleManager object to create
     */
    createRuleManager(ruleManager) {
        return this.http.post(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_USER + this.METHOD_USER, ruleManager, Utils.getJwt())
        .map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
    
    /**
     * Updates a ruleManager
     * @param updated ruleManager
     */
    updateRuleManager(ruleManager) {
        return this.http.put(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_USER + this.METHOD_USER,
                JSON.stringify(ruleManager), Utils.getJwt()).map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
    
    /**
     * Deletes a rule manager
     * @param id of the ruleManager
     */
    deleteRuleManager(ruleManagerId) {
        return this.http.put(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_USER + this.METHOD_DELETE_USER,
                ruleManagerId, Utils.getJwt()).map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
}