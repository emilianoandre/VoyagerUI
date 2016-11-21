/**
 * Home Component
 * This class contains all the tabs and the global info of the app
 * @author eandre
 */
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// Components
import { UserTypeComponent } from '../user-type/user-type.component';
import { BugSystemTypeComponent } from '../bug-system-type/bug-system-type.component';
import { RuleManagerTypeComponent } from '../rule-manager-type/rule-manager-type.component'
import { PermissionComponent } from '../permission/permission.component';
import { UserComponent } from '../user/user.component';

// Models
import { Type } from '../shared/models/type'
import { User } from '../shared/models/user'
import { Permission } from '../shared/models/permission'

// Services
import { AlertService } from '../shared/services/alert.service';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})
 
export class HomeComponent {
    
    // Childs
    @ViewChild(UserTypeComponent) userTypeComponent: UserTypeComponent;
    @ViewChild(BugSystemTypeComponent) bugSystemTypeComponent: BugSystemTypeComponent;
    @ViewChild(RuleManagerTypeComponent) ruleManagerTypeComponent: RuleManagerTypeComponent;
    @ViewChild(PermissionComponent) permissionComponent: PermissionComponent;
    @ViewChild(UserComponent) userComponent: UserComponent;
    
    // Variables
    userTypes:Array<Type>;
    bugSystemTypes:Array<Type>;
    ruleManagerTypes:Array<Type>;
    permissions:Array<Type>;
    users:Array<User>;
    
    
    constructor(private alertService: AlertService) {
    }
 
    ngAfterViewInit() {
        $('#loadingModal').modal({
            backdrop: 'static',
            keyboard: false
        });
        this.showLoadingModal();
        Observable.forkJoin(
                this.userTypeComponent.loadUserTypes(),
                this.bugSystemTypeComponent.loadBugSystemTypes(),
                this.ruleManagerTypeComponent.loadRuleManagerTypes(),
                this.permissionComponent.loadPermissions(),
                this.userComponent.loadUsers()
              ).subscribe(
                  result => {
                      
                      // Load User Types
                      if (result[0] && result[0].body) {
                          this.userTypes = result[0].body;
                          this.userTypeComponent.fillData(result[0].body);
                      } else if (result[0].error) {
                          this.alertService.error(result[0].error);
                      }
                      
                      // Load Bug System Types
                      if (result[1] && result[1].body) {
                          this.bugSystemTypes = result[1].body; 
                          this.bugSystemTypeComponent.fillData(result[1].body);
                      } else if (result[1].error) {
                          this.alertService.error(result[1].error);
                      }
                      
                      // Load Rule Manager Types
                      if (result[2] && result[2].body) {
                          this.ruleManagerTypes = result[2].body; 
                          this.ruleManagerTypeComponent.fillData(result[2].body);
                      } else if (result[2].error) {
                          this.alertService.error(result[2].error);
                      }
                      
                      // Load permissions
                      if (result[3] && result[3].body) {
                          this.permissions = result[3].body;
                          this.permissionComponent.fillData(result[3].body);
                      } else if (result[3].error) {
                          this.alertService.error(result[3].error);
                      }
                      
                      // Load Users
                      if (result[4] && result[4].body && result[0] && result[0].body) {
                          this.users = result[4].body;
                          this.userComponent.fillData(result[4].body, result[0].body);
                      } else if (result[4].error) {
                          this.alertService.error(result[4].error);
                      }
                      
                      this.hideLoadingModal();
                  },
                  error => {
                      this.hideLoadingModal();
                  }
              );
    }
    
    /**
     * Function used to handle the requests of the child tabs to update the loading model
     * After receiving the request, the decision is taken whether to fire the update event to the app.component class with a request to show or hide
     * the loading modal.
     * @param request show or hide
     */
    private updateLoadingModal(request) {
        if (request == "show")
            this.showLoadingModal();
        else
            this.hideLoadingModal();
    }
    
    /**
    * Function used to show the loader
    */
    private showLoadingModal() {
        $('#loadingModal').modal('show');
    }
    
    /**
    * Function used to hide the loader
    */
    private hideLoadingModal() {
        $('#loadingModal').modal('hide');
    }
}