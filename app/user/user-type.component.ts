/**
 * User Type component that holds the user type list
 * @author eandre
 * 
 */
import { Component, OnInit } from '@angular/core';

//Services
import { TypeService } from '../shared/services/type.service';
import { AlertService } from '../shared/services/alert.service';

@Component({
    moduleId : module.id,
    selector : 'user-type-list',
    templateUrl : 'user-type.component.html'
})

export class UserTypeComponent implements OnInit {
    
    displayDialog : boolean;
    userType:any = new PrimeUserType();
    selectedUserType : any;
    newUserType : boolean;
    userTypes;
    cols : any[];    
    loading = false;

    constructor(private typeService: TypeService, 
            private alertService: AlertService) { }

    ngOnInit() {
        // Start the loading widget
        this.loading = true;
        
        this.typeService.getUserTypes()
        .subscribe(
            data => {
                this.userTypes = data;
                // Stop the loading widget
                this.loading = false;
            },
            error => {
                this.alertService.error('Failed to load the User Types. ' + error);
                // Stop the loading widget
                this.loading = false;
            });
        
        this.cols = [
                     {field: 'idUserType', header: 'ID'},
                     {field: 'name', header: 'Name'}
                 ];
    }
    
    showDialogToAdd() {
        this.newUserType = true;
        this.userType = new PrimeUserType();
        this.displayDialog = true;
    }
    
    save() {
        if (this.newUserType) {
            this.userTypes.push(this.userType);
        } else {
            this.userTypes[this.findSelectedUserTypeIndex()] = this.userType;
        }
        
        this.userType = null;
        this.displayDialog = false;
    }
    
    delete() {
        this.userTypes.splice(this.findSelectedUserTypeIndex(), 1);
        this.userType = null;
        this.displayDialog = false;
    }    
    
    onRowSelect(event) {
        this.newUserType = false;
        this.userType = this.cloneUserType(event.data);
        this.displayDialog = true;
    }
    
    cloneUserType(c: PrimeUserType): PrimeUserType {
        let userType = new PrimeUserType();
        for(let prop in c) {
            userType[prop] = c[prop];
        }
        return userType;
    }
    
    findSelectedUserTypeIndex(): number {
        return this.userTypes.indexOf(this.selectedUserType);
    }
}

class PrimeUserType {
    
    constructor(public idUserTypeidUserType?, public name?) {}
}