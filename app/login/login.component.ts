/**
 * Description: Login Component 
 * @author eandre
 *
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
 
// Services
import { AlertService } from '../shared/services/alert.service';
import { AuthenticationService } from '../shared/services/authentication.service';
 
@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html'
})
 
export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
 
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) { }
 
    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
    }
 
    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
                data => {
                    if (data.error) {
                        this.alertService.error('Failed to log in. ' + data.error);
                        this.loading = false;
                    } else {
                        // login successful if there's a jwt token in the response
                        let token = data.body;
                        if (token) {
                            // store user details and jwt token in local storage to keep user logged in between page refreshes
                            localStorage.setItem('currentUser', token);
                        }
                        this.router.navigate(['/']);
                    }
                },
                error => {
                    this.alertService.error('Failed to log in. ' + error);
                    this.loading = false;
                });
    }
}