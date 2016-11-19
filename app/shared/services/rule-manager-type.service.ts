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
export class RuleManagerTypeService {
    
    // Constants
    private SERVICE_TYPES = "RuleManagerType/";
    private METHOD_RULE_MANAGER_TYPE = "ruleManagerType";
    private METHOD_DELETE_RULE_MANAGER_TYPE = "deleteRuleManagerType";
    
    constructor(private http: Http) { }
    
    /**
     * Gets the list of ruleManager types
     */
    getRuleManagerTypes() {        
        // Get Response        
        return this.http.get(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_TYPES + this.METHOD_RULE_MANAGER_TYPE, Utils.getJwt())
        .map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
    
    /**
     * Creates a ruleManager type from a name
     * @param name of the ruleManager type
     */
    createRuleManagerType(name) {
        return this.http.post(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_TYPES + this.METHOD_RULE_MANAGER_TYPE, name, Utils.getJwt())
        .map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
    
    /**
     * Updates a ruleManager type
     * @param updated ruleManager type
     */
    updateRuleManagerType(ruleManagerType) {
        return this.http.put(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_TYPES + this.METHOD_RULE_MANAGER_TYPE,
                JSON.stringify(ruleManagerType), Utils.getJwt()).map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
    
    /**
     * Deletes a ruleManager type
     */
    deleteRuleManagerType(ruleManagerTypeId) {
        return this.http.put(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_TYPES + this.METHOD_DELETE_RULE_MANAGER_TYPE,
                ruleManagerTypeId, Utils.getJwt()).map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
}