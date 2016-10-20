/**
 * Utils file with methods to be used by the entire app
 * 
 * @author eandre
 */
import { Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';


export class Utils {
    constructor() { }
    
    // Public helper methods
    /**
     * Returns the JWT to be used in future GET API calls
     */
    static getJwt():RequestOptions {
        // Create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token, 'Content-Type': 'application/json' });
            return new RequestOptions({ headers: headers });
        }
    }
    
    /**
     * Returns the correct headers to be used when calling a Post or PUT WS
     */
    static getHeaders():RequestOptions {
        // Define headers
        let headers = new Headers({ 'Content-Type': 'application/json' });
        return new RequestOptions({ headers: headers });
    }
    
    /**
     * Handles an error in an HTTP call
     */
    static handleServerError(err: Response) {
        // If we received a response display the status code
        if(err instanceof Response) {
          return Observable.throw('Error when contacting the server. Error status: ' + err.status);
        }
        return Observable.throw(err || 'Error contacting the server');
    }
}
        
