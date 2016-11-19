/**
 * Permissions Service
 * @author eandre
 */
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

//Shared
import { Constants } from '../utils/constants';
import { Utils } from '../utils/utils';

@Injectable()
export class PermissionService {
    
    // Constants
    private SERVICE_TYPES = "Permission/";
    private METHOD_PERMISSION = "permission";
    private METHOD_DELETE_PERMISSION = "deletePermission";
    
    constructor(private http: Http) { }
    
    /**
     * Gets the list of permissions
     */
    getPermissions() {        
        // Get Response        
        return this.http.get(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_TYPES + this.METHOD_PERMISSION, Utils.getJwt())
        .map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
    
    /**
     * Creates a permission from a name
     * @param name of the permission 
     */
    createPermission(name) {
        return this.http.post(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_TYPES + this.METHOD_PERMISSION, name, Utils.getJwt())
        .map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
    
    /**
     * Updates a permission
     * @param updated permission 
     */
    updatePermission(permission) {
        return this.http.put(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_TYPES + this.METHOD_PERMISSION,
                JSON.stringify(permission), Utils.getJwt()).map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
    
    /**
     * Deletes a permission
     */
    deletePermission(permissionId) {
        return this.http.put(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_TYPES + this.METHOD_DELETE_PERMISSION,
                permissionId, Utils.getJwt()).map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
}