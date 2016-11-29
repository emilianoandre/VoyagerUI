/**
 * User Type component that holds the user type list
 * @author eandre
 * 
 */
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormsModule } from '@angular/forms';
import { Message, SelectItem } from 'primeng/primeng';

// Services
import { UserTypeService } from '../shared/services/user-type.service';
import { AlertService } from '../shared/services/alert.service';

// Models
import { Type } from '../shared/models/type';

@Component({
    moduleId : module.id,
    selector : 'user-type-component',
    templateUrl : 'user-type.component.html'
})

export class UserTypeComponent implements OnInit {
    //Events
    @Output('loadingModal') updateLoadingModal = new EventEmitter(); //Event handled by home.component to show and hide the loading widget
    @Output('updateData') updateData = new EventEmitter(); //Event handled by home.component to update data in other tabs
    
    displayDialog : boolean;
    userType:Type = new Type();
    selectedUserType : Type;
    newUserType : boolean;
    userTypes;
    msgs: Message[] = [];
    userTypeForm: FormGroup;
    
    // Columns to be displayed in the table
    cols : any[];

    constructor(private userTypeService: UserTypeService, 
            private alertService: AlertService,
            private formBuilder: FormBuilder) { }

    ngOnInit() {
        // Set up validations
        this.userTypeForm = this.formBuilder.group({
            'userTypeId': new FormControl({value: '', disabled: true}),
            'userTypeName': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)]))
        });
        
        this.cols = [
                     {field: 'idType', header: 'ID',  styleClass:'idColumn'},
                     {field: 'name', header: 'Name'}
                     ];
    }
    
    /**
     * Returns an observer with the call to load the user types
     * Observable call object
     */
    loadUserTypes() {
        let getUserTypesObservable = this.userTypeService.getUserTypes();
        
        getUserTypesObservable.subscribe(
            data => { },
            error => {
                this.alertService.error('Failed to load the User Types. ' + error);
            });
        
        return getUserTypesObservable;
    }
    
    /**
     * Function used to fill the data in the screen
     * @param userTypes list of userTypes to load
     */
    fillData(userTypes) {
        this.userTypes = userTypes;
    }
    
    /**
     *  Display Add/Edit Dialog
     *  @param create: boolean to know if we should display add or edit dialog
     *  @param selectedUserType: selected user type
     */
    showDialog(create:boolean, selectedUserType:Type) {
        
        // Clear Alerts
        this.alertService.clearAlert();
        this.userTypeForm.markAsPristine(false);
        
        // Check if a row was selected on edit
        if (!create && !selectedUserType) {
            this.alertService.error('Please select a row');
            return;
        }
        
        this.newUserType = create;
        if (create) {
            this.userType = new Type();
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
        this.showLoadingModal();
        
        // Close the dialog
        this.displayDialog = false;
        
        // Check if it's a new user type
        if (this.newUserType) {
            this.userTypeService.createUserType(this.userType.name)
            .subscribe(
                data => {
                    if (data.error) {
                        this.alertService.error(data.error);
                    } else {
                        this.userTypes.push(data.body);
                        this.updateUserTypes();
                    }
                },
                error => {
                    this.alertService.error('Failed to create User Type. ' + error);
                },
                () => {
                    // Stop the loading widget
                    this.hideLoadingModal();
                });
        } else {
            this.userTypeService.updateUserType(this.userType)
            .subscribe(
                data => {
                    if (data.error) {
                        this.alertService.error(data.error);
                    } else {                
                        this.userTypes[this.findSelectedUserTypeIndex()] = this.userType;
                        this.updateUserTypes();
                    }
                    // Stop the loading widget
                    this.hideLoadingModal();
                },
                error => {
                    this.alertService.error('Failed to update User Type. ' + error);
                    // Stop the loading widget
                    this.hideLoadingModal();
                },
                () => {
                    // Stop the loading widget
                    this.hideLoadingModal();
                });
        }

    }
    
    /**
     * Deletes a user type
     * @param selectedUserType: selected user type
     */
    deleteUserType(selectedUserType:Type) {
        // Clear Alerts
        this.alertService.clearAlert();
        if (!selectedUserType) {
            this.alertService.error('Please select a row');
            return;
        }
        
        // Start the loading widget
        this.showLoadingModal();
        
        this.userTypeService.deleteUserType(this.selectedUserType.idType)
        .subscribe(
            data => {
                if (data && data.error) {
                    this.alertService.error(data.error);
                } else {
                    this.userTypes.splice(this.findSelectedUserTypeIndex(), 1);
                    this.updateUserTypes();
                }
            },
            error => {
                this.alertService.error('Failed to delete User Type. ' + error);                   
            },
            () => {
                this.selectedUserType = null;
                // Stop the loading widget
                this.hideLoadingModal();
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
    cloneUserType(userType: Type): Type {
        let userTypeToUpdate = new Type();
        for(let prop in userType) {
            userTypeToUpdate[prop] = userType[prop];
        }
        return userTypeToUpdate;
    }
    
    /**
     * Function used to update other forms data with the changes to user types
     */
    private updateUserTypes() {
        this.updateData.emit(this.userTypes);
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
