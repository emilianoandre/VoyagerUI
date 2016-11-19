/**
 * Permission component that holds the permission  list
 * @author eandre
 * 
 */
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormsModule } from '@angular/forms';
import { Message, SelectItem } from 'primeng/primeng';

// Services
import { PermissionService } from '../shared/services/permission.service';
import { AlertService } from '../shared/services/alert.service';

// Models
import { Permission } from '../shared/models/permission';

@Component({
    moduleId : module.id,
    selector : 'permission-component',
    templateUrl : 'permission.component.html'
})

export class PermissionComponent implements OnInit {
    
    //Events
    @Output('loadingModal') updateLoadingModal = new EventEmitter(); //Event handled by home.component to show and hide the loading widget
    
    displayDialog : boolean;
    permission:Permission = new Permission();
    selectedPermission : Permission;
    newPermission : boolean;
    permissions;
    msgs: Message[] = [];
    permissionForm: FormGroup;    
    submitted: boolean;
    
    // Columns to be displayed in the table
    cols : any[];

    constructor(private permissionService: PermissionService, 
            private alertService: AlertService,
            private formBuilder: FormBuilder) { }

    ngOnInit() {
        // Set up validations
        this.permissionForm = this.formBuilder.group({
            'permissionId': new FormControl({value: '', disabled: true}),
            'permissionName': new FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(100)]))
        });
        
        this.cols = [
                     {field: 'idPermission', header: 'ID',  styleClass:'idColumn'},
                     {field: 'name', header: 'Name'}
                     ];
    }
    
    /**
     * Returns an observer with the call to load the permissions
     * Observable call object
     */
    loadPermissions() {
        let permissionObservable = this.permissionService.getPermissions();
        permissionObservable.subscribe(
            data => {
                if (data.error) {
                    this.alertService.error(data.error);
                }
            },
            error => {
                this.alertService.error('Failed to load the Permissions. ' + error);
            });
        
        return permissionObservable;
    }
    
    /**
     * Function used to fill the data in the screen
     * @param permissions list of permissions to load
     */
    fillData(permissions) {
        this.permissions = permissions;
    }
    
    /**
     * Get the message from the Add/Edit form
     */
    get diagnostic() { 
        return JSON.stringify(this.permissionForm.value);        
    }
    
    /**
     *  Display Add/Edit Dialog
     *  @param create: boolean to know if we should display add or edit dialog
     *  @param selectedPermission: selected permission 
     */
    showDialog(create:boolean, selectedPermission:Permission) {
        
        // Clear Alerts
        this.alertService.clearAlert();
        this.permissionForm.markAsPristine(false);
        
        // Check if a row was selected on edit
        if (!create && !selectedPermission) {
            this.alertService.error('Please select a row');
            return;
        }
        
        this.newPermission = create;
        if (create) {
            this.permission = new Permission();
            this.displayDialog = true;
        } else {
            this.permission = this.clonePermission(selectedPermission);
        }
        this.displayDialog = true;
    }
    
    /**
     * Saves a new or old permission 
     */
    save() {
        // Start the loading widget
        this.showLoadingModal();
        
        // Close the dialog
        this.displayDialog = false;
        
        // Check if it's a new permission 
        if (this.newPermission) {
            this.permissionService.createPermission(this.permission.name)
            .subscribe(
                data => {
                    if (data.error) {
                        this.alertService.error(data.error);
                    } else {
                        this.permissions.push(data.body);
                    }
                },
                error => {
                    this.alertService.error('Failed to create Permission. ' + error);
                },
                () => {
                    // Stop the loading widget
                    this.hideLoadingModal();
                });
        } else {
            this.permissionService.updatePermission(this.permission)
            .subscribe(
                data => {
                    if (data.error) {
                        this.alertService.error(data.error);
                    } else {                
                        this.permissions[this.findSelectedPermissionIndex()] = this.permission;
                    }
                    // Stop the loading widget
                    this.hideLoadingModal();
                },
                error => {
                    this.alertService.error('Failed to update Permission. ' + error);
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
     * Deletes a permission
     * @param selectedPermission: selected permission
     */
    deletePermission(selectedPermission:Permission) {
        // Clear Alerts
        this.alertService.clearAlert();
        if (!selectedPermission) {
            this.alertService.error('Please select a row');
            return;
        }
        
        // Start the loading widget
        this.showLoadingModal();
        
        this.permissionService.deletePermission(this.selectedPermission.idPermission)
        .subscribe(
            data => {
                if (data && data.error) {
                    this.alertService.error(data.error);
                } else {
                    this.permissions.splice(this.findSelectedPermissionIndex(), 1);
                }
            },
            error => {
                this.alertService.error('Failed to delete Permission. ' + error);                   
            },
            () => {
                // Stop the loading widget
                this.hideLoadingModal();
            });
    }
    
    /**
     * Returns the selected permission  by index
     */
    findSelectedPermissionIndex(): number {
        return this.permissions.indexOf(this.selectedPermission);
    }
    
    /**
     * Closes the Add/Edit dialog
     */
    closeDialog() {
     // Close the dialog
        this.displayDialog = false;
    }
    
    /**
     * Clones a permission
     * @param permission permission to clone
     */
    clonePermission(permission: Permission):Permission {
        let permissionToUpdate = new Permission();
        for(let prop in permission) {
            permissionToUpdate[prop] = permission[prop];
        }
        return permissionToUpdate;
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
