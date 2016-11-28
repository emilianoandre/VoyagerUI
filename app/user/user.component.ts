/**
 * User component that holds the user list
 * @author eandre
 * 
 */
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Message, SelectItem } from 'primeng/primeng';

// Services
import { UserService } from '../shared/services/user.service';
import { AlertService } from '../shared/services/alert.service';

// Models
import { User } from '../shared/models/user'

@Component({
    moduleId : module.id,
    selector : 'user-component',
    templateUrl : 'user.component.html'
})

export class UserComponent implements OnInit {
    
  //Events
    @Output('loadingModal') updateLoadingModal = new EventEmitter(); //Event handled by home.component to show and hide the loading widget
    
    displayDialog : boolean;
    user:User = new User();
    selectedUser : User;
    newUser : boolean;
    users;
    userTypes;
    userTypesList: SelectItem[];
    msgs: Message[] = [];
    userForm: FormGroup;
    
    // Columns to be displayed in the table
    cols : any[];

    constructor(private userService: UserService, 
            private alertService: AlertService,
            private fb: FormBuilder) { }

    ngOnInit() {        
        // Set up validations
        this.userForm = this.fb.group({
            'userId': new FormControl({value: '', disabled: true}),
            'userName': new FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(100)])),
            'name': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])),
            'email': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])),
            'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(100)])),
            'userType': new FormControl('', Validators.required)
        });
        
        this.cols = [
                     {field: 'idUser', header: 'ID',  styleClass:'idColumn'},
                     {field: 'userName', header: 'User Name'},
                     {field: 'name', header: 'Name'},
                     {field: 'userType.name', header: 'User Type'},
                     {field: 'email', header: 'Email'}
                 ];
    }
    
    /**
     * Returns an observer with the call to load the user types
     * Observable call object
     */
    loadUsers() {
        let usersObservable = this.userService.getUsers();
        usersObservable.subscribe(
                data => { },
                error => {
                    this.alertService.error('Failed to load the Users. ' + error);
                });
        
        return usersObservable;
    }
    
    /**
     * Function used to fill the data in the screen
     * @param users list of users to load
     * @param userTypes list of user types
     */
    fillData(users, userTypes) {
        this.users = users;
        this.userTypes = userTypes;
        this.userTypesList = userTypes.map(function(userType){return {
            label:userType.name, value:userType};
        });
    }
    
    /**
     *  Display Add/Edit Dialog
     *  @param create: boolean to know if we should display add or edit dialog
     *  @param selectedUser: selected user
     */
    showDialog(create:boolean, selectedUser:User) {
        
        // Clear Alerts
        this.alertService.clearAlert();
        this.userForm.markAsPristine(false);
        
        // Check if a row was selected on edit
        if (!create && !selectedUser) {
            this.alertService.error('Please select a row');
            return;
        }
        
        this.newUser = create;
        if (create) {
            // Set the default values
            this.user = new User();
            this.user.userType = this.userTypes[0];
            
            this.displayDialog = true;
        } else {        
            this.user = this.cloneUser(selectedUser);
        }
        this.displayDialog = true;
    }
    
    /**
     * Saves a new or old user
     */
    save() {
        // Start the loading widget
        this.showLoadingModal();
        
        // Check if it's a new user
        if (this.newUser) {
            this.userService.createUser(this.user)
            .subscribe(
                data => {
                    if (data.error) {
                        this.alertService.error(data.error);
                    } else {
                        this.users.push(data.body);
                    }
                },
                error => {
                    this.alertService.error('Failed to create User. ' + error);
                },
                () => {
                    // Stop the loading widget
                    this.hideLoadingModal();
                });
        } else {
            this.userService.updateUser(this.user)
            .subscribe(
                data => {
                    if (data.error) {
                        this.alertService.error(data.error);
                    } else {                
                        this.users[this.findSelectedUserIndex()] = this.user;
                    }
                    // Stop the loading widget
                    this.hideLoadingModal();
                },
                error => {
                    this.alertService.error('Failed to update User. ' + error);
                    // Stop the loading widget
                    this.hideLoadingModal();
                },
                () => {
                    // Stop the loading widget
                    this.hideLoadingModal();
                });
        }
        
        // Close the dialog
        this.displayDialog = false;
    }
    
    /**
     * Deletes a user
     * @param selectedUser: selected user
     */
    deleteUser(selectedUser:User) {
        // Clear Alerts
        this.alertService.clearAlert();
        if (!selectedUser) {
            this.alertService.error('Please select a row');
            return;
        }
        
        // Start the loading widget
        this.showLoadingModal();
        
        this.userService.deleteUser(this.selectedUser.idUser)
        .subscribe(
            data => {
                if (data && data.error) {
                    this.alertService.error(data.error);
                } else {            
                    this.users.splice(this.findSelectedUserIndex(), 1);
                }
            },
            error => {
                this.alertService.error('Failed to delete User. ' + error);                   
            },
            () => {
                this.selectedUser = null;
                // Stop the loading widget
                this.hideLoadingModal();
            });
    }
    
    /**
     * Returns the selected user by index
     */
    findSelectedUserIndex(): number {
        return this.users.indexOf(this.selectedUser);
    }
    
    /**
     * Closes the Add/Edit dialog
     */
    closeDialog() {
        // Close the dialog
        this.displayDialog = false;
    }
    
    /**
     * Clones a user
     * @param user user to clone
     */
    cloneUser(user: User): User {
        let userToUpdate = new User();
        for(let prop in user) {
            userToUpdate[prop] = user[prop];
        }
        return userToUpdate;
    }
    
    /**
     * Function used to emit updateLoadingModal event with a request to show the loading modal if it is not showing yet
     */
    private showLoadingModal() {
        this.updateLoadingModal.emit('show');
    }
    
    /**
     * Function used to emit the updateLoadingModal event with a request to hide the loading modal
     */
    private hideLoadingModal() {
        this.updateLoadingModal.emit('hide');
    }
}
