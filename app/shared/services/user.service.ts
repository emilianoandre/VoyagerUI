/**
 * User Service
 * @author eandre
 */
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

//Shared
import { Utils } from '../utils/utils';

@Injectable()
export class UserService {
    
    // Constants
    private SERVICE_USER = "Login/";
    
    constructor(private http: Http) { }
 
    getAll() {
        return this.http.get('/api/users', Utils.getJwt()).map((response: Response) => response.json());
    }
 
    getById(id) {
        return this.http.get('/api/users/' + id, Utils.getJwt()).map((response: Response) => response.json());
    }
 
    create(user) {
        return this.http.post('/api/users', user, Utils.getJwt()).map((response: Response) => response.json());
    }
 
    update(user) {
        return this.http.put('/api/users/' + user.id, user, Utils.getJwt()).map((response: Response) => response.json());
    }
 
    delete(id) {
        return this.http.put('/api/users/' + id, Utils.getJwt()).map((response: Response) => response.json());
    }
}