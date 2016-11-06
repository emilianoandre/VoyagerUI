/**
 * Home Component
 * This class contains all the tabs and the global info of the app
 * @author eandre
 */
import { Component, ViewChild, AfterViewInit } from '@angular/core';

// Components
import { UserTypeComponent } from '../user/user-type.component'
import { UserComponent } from '../user/user.component'

// Models
import { UserType } from '../user/user-type'
import { User } from '../user/user'

 
@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})
 
export class HomeComponent {
    
    // Childs
    @ViewChild(UserTypeComponent) userTypeComponent: UserTypeComponent;
    //@ViewChild(UserComponent) userComponent: UserComponent;
    
    // Variables
    userTypes:Array<UserType>;
    users:Array<User>;
    
    constructor() {
    }
 
    ngAfterViewInit() {
    }
}