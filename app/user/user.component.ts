/**
 * User component that holds the user list
 * @author eandre
 * 
 */
import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Message, SelectItem } from 'primeng/primeng';

// Services
import { UserService } from '../shared/services/user.service';
import { AlertService } from '../shared/services/alert.service';

// Models
import { User } from './user'

@Component({
    moduleId : module.id,
    selector : 'user-list',
    templateUrl : 'user.component.html'
})

export class UserComponent implements OnInit {
    
    displayDialog : boolean;
    user:User = new User();
    selectedUser : User;
    newUser : boolean;
    users;
    msgs: Message[] = [];
    userform: FormGroup;    
    submitted: boolean;
    
    // Columns to be displayed in the table
    cols : any[];
    
    // Loading widget display
    loading = false;

    constructor(private userService: UserService, 
            private alertService: AlertService,
            private fb: FormBuilder) { }

    ngOnInit() {
        // Start the loading widget
        this.loading = true;
        
        // Set up validations
        this.userform = this.fb.group({
            'userId': new FormControl(''),
            'userName': new FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(100)])),
            'name': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])),
            'email': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])),
            'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(100)]))
        });
        
        this.loadUsers();
        
        this.cols = [
                     {field: 'idUser', header: 'ID'},
                     {field: 'userName', header: 'User Name'},
                     {field: 'name', header: 'Name'},
                     {field: 'email', header: 'Email'}
                 ];
    }
    
    /**
     * Returns an observer with the call to load the user types
     * Observable call object
     */
    loadUsers() {
        return  this.userService.getUsers()
        .subscribe(
                data => {
                    if (data.error) {
                        this.alertService.error(data.error);
                    } else {            
                        this.users = data.body;
                    }
                    // Stop the loading widget
                    this.loading = false;
                },
                error => {
                    this.alertService.error('Failed to load the Users. ' + error);
                    // Stop the loading widget
                    this.loading = false;
                }); 
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
    get diagnostic() { return JSON.stringify(this.userform.value); }
    
    /**
     *  Display Add/Edit Dialog
     *  @param create: boolean to know if we should display add or edit dialog
     *  @param selectedUser: selected user
     */
    showDialog(create:boolean, selectedUser:User) {
        
        // Clear Alerts
        this.alertService.clearAlert();
        
        // Check if a row was selected on edit
        if (!create && !selectedUser) {
            this.alertService.error('Please select a row');
            return;
        }
        
        this.newUser = create;
        if (create) {
            this.user = new User();
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
        this.loading = true;
        
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
                    this.user = new User();
                    // Stop the loading widget
                    this.loading = false;
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
                    this.loading = false;
                },
                error => {
                    this.alertService.error('Failed to update User. ' + error);
                    // Stop the loading widget
                    this.loading = false;
                },
                () => {
                    this.user = new User();
                    // Stop the loading widget
                    this.loading = false;
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
        this.loading = true;
        
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
                this.user = null;
                // Stop the loading widget
                this.loading = false;
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
}
