/**
 * User Type component that holds the user type list
 * @author eandre
 * 
 */
import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Message, SelectItem } from 'primeng/primeng';

// Services
import { UserTypeService } from '../shared/services/user-type.service';
import { AlertService } from '../shared/services/alert.service';

// Models
import { UserType } from './user-type'

@Component({
    moduleId : module.id,
    selector : 'user-type-list',
    templateUrl : 'user-type.component.html'
})

export class UserTypeComponent implements OnInit {
    
    displayDialog : boolean;
    userType:UserType = new UserType();
    selectedUserType : UserType;
    newUserType : boolean;
    userTypes;
    msgs: Message[] = [];
    userTypeform: FormGroup;    
    submitted: boolean;
    
    // Columns to be displayed in the table
    cols : any[];
    
    // Loading widget display
    loading = false;

    constructor(private userTypeService: UserTypeService, 
            private alertService: AlertService,
            private fb: FormBuilder) { }

    ngOnInit() {
        // Start the loading widget
        this.loading = true;
        
        // Set up validations
        this.userTypeform = this.fb.group({
            'userTypeId': new FormControl(''),
            'userTypeName': new FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(100)]))
        });
        
        this.userTypeService.getUserTypes()
        .subscribe(
            data => {
                if (data.error) {
                    this.alertService.error(data.error);
                } else {            
                    this.userTypes = data.body;
                }
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
    
    /**
     * Code to be executed when submitting the form
     * 
     */
    onSubmit(value: string) {
        this.submitted = true;
        this.msgs = [];
        this.msgs.push({severity:'info', summary:'Success', detail:'Form Submitted'});
    }
    
    /**
     * Get the message from the Add/Edit form
     */
    get diagnostic() { return JSON.stringify(this.userTypeform.value); }
    
    /**
     *  Display Add/Edit Dialog
     *  @param create: boolean to know if we should display add or edit dialog
     *  @param selectedUserType: selected user type
     */
    showDialog(create:boolean, selectedUserType:UserType) {
        
        // Clear Alerts
        this.alertService.clearAlert();
        
        // Check if a row was selected on edit
        if (!create && !selectedUserType) {
            this.alertService.error('Please select a row');
            return;
        }
        
        this.newUserType = create;
        if (create) {
            this.userType = new UserType();
            this.displayDialog = true;
        } else {        
            this.userType = this.cloneUserType(selectedUserType);
        }
        this.displayDialog = true;
    }
    
    /**
     * Saves a new or old user Type
     */
    save() {
        // Start the loading widget
        this.loading = true;
        
        // Check if it's a new user type
        if (this.newUserType) {
            this.userTypeService.createUserType(this.userType.name)
            .subscribe(
                data => {
                    if (data.error) {
                        this.alertService.error(data.error);
                    } else {
                        this.userTypes.push(data.body);
                    }
                },
                error => {
                    this.alertService.error('Failed to create User Type. ' + error);
                },
                () => {
                    this.userType = null;
                    // Stop the loading widget
                    this.loading = false;
                });
        } else {
            this.userTypeService.updateUserType(this.userType)
            .subscribe(
                data => {
                    if (data.error) {
                        this.alertService.error(data.error);
                    } else {                
                        this.userTypes[this.findSelectedUserTypeIndex()] = this.userType;
                    }
                    // Stop the loading widget
                    this.loading = false;
                },
                error => {
                    this.alertService.error('Failed to update User Type. ' + error);
                    // Stop the loading widget
                    this.loading = false;
                },
                () => {
                    this.userType = null;
                    // Stop the loading widget
                    this.loading = false;
                });
        }
        
        // Close the dialog
        this.displayDialog = false;
    }
    
    /**
     * Deletes a user type
     * @param selectedUserType: selected user type
     */
    deleteUserType(selectedUserType:UserType) {
        // Clear Alerts
        this.alertService.clearAlert();
        if (!selectedUserType) {
            this.alertService.error('Please select a row');
            return;
        }
        
        // Start the loading widget
        this.loading = true;
        
        this.userTypeService.deleteUserType(this.selectedUserType.idUserType)
        .subscribe(
            data => {
                if (data && data.error) {
                    this.alertService.error(data.error);
                } else {            
                    this.userTypes.splice(this.findSelectedUserTypeIndex(), 1);
                }
            },
            error => {
                this.alertService.error('Failed to delete User Type. ' + error);                   
            },
            () => {
                this.userType = null;
                // Stop the loading widget
                this.loading = false;
            });
    }
    
    /**
     * Returns the selected user type by index
     */
    findSelectedUserTypeIndex(): number {
        return this.userTypes.indexOf(this.selectedUserType);
    }
    
    /**
     * Closes the Add/Edit dialog
     */
    closeDialog() {
     // Close the dialog
        this.displayDialog = false;
    }
    
    /**
     * Clones a user type
     * @param userType user type to clone
     */
    cloneUserType(userType: UserType): UserType {
        let userTypeToUpdate = new UserType();
        for(let prop in userType) {
            userTypeToUpdate[prop] = userType[prop];
        }
        return userTypeToUpdate;
    }
}
