/**
 * Project Service
 * @author eandre
 */
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

//Shared
import { Constants } from '../utils/constants';
import { Utils } from '../utils/utils';

@Injectable()
export class ProjectService {
    
    // Constants
    private SERVICE_USER = "Project/";
    private METHOD_USER = "project";
    private METHOD_DELETE_USER = "deleteProject";
    
    constructor(private http: Http) { }
    
    /**
     * Gets the list of projects
     */
    getProjects() {        
        // Get Response        
        return this.http.get(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_USER + this.METHOD_USER, Utils.getJwt())
        .map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
    
    /**
     * Creates a project
     * @param project object to create
     */
    createProject(project) {
        return this.http.post(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_USER + this.METHOD_USER, project, Utils.getJwt())
        .map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
    
    /**
     * Updates a project
     * @param updated project
     */
    updateProject(project) {
        return this.http.put(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_USER + this.METHOD_USER,
                JSON.stringify(project), Utils.getJwt()).map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
    
    /**
     * Deletes a project
     * @param id of the project
     */
    deleteProject(projectId) {
        return this.http.put(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_USER + this.METHOD_DELETE_USER,
                projectId, Utils.getJwt()).map(Utils.handleServerResponse).catch(Utils.handleServerErrors);
    }
}