/**
 * Main App Component file
 * @author eandre
 */
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { AlertService } from './shared/services/alert.service';
import { AuthenticationService } from './shared/services/authentication.service';

 
@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: 'app.component.html'
})
 
export class AppComponent {
    loggedIn:boolean;

    constructor (private router: Router,            
            private authenticationService: AuthenticationService,
            private alertService: AlertService) {}

    /**
     * Logs out the current user
     */
    private logout() {
        this.authenticationService.logout()
        .subscribe(
            data => {
                if (data.error) {
                    this.alertService.error('Failed to log out. ' + data.error);
                } else {
                    // remove user from local storage to log user out
                    localStorage.removeItem('currentUser');
                    this.loggedIn = false;
                    this.router.navigate(['/login']);
                }
            },
            error => {
                this.alertService.error('Failed to log out. ' + error);
            });
    }
    
    private logIn(){
        this.loggedIn = true;
    }
}