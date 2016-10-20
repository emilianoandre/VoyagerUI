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
export class TypeService {
    
    // Constants
    private SERVICE_TYPES = "Types/";
    private METHOD_USER_TYPES = "userTypes";
    
    constructor(private http: Http) { }
    
    getUserTypes() {
        
        // Define headers
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        
        // Get Response        
        return this.http.get(Constants.SERVER_URL + Constants.SERVER_APP_NAME + this.SERVICE_TYPES + this.METHOD_USER_TYPES, Utils.getJwt())
        .map((response: Response) => response.json()).catch(Utils.handleServerError);
    }
}