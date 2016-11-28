/**
 * bugSystem Type component that holds the bugSystem type list
 * @author eandre
 * 
 */
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormsModule } from '@angular/forms';
import { Message, SelectItem } from 'primeng/primeng';

// Services
import { BugSystemTypeService } from '../shared/services/bug-system-type.service';
import { AlertService } from '../shared/services/alert.service';

// Models
import { Type } from '../shared/models/type'

@Component({
    moduleId : module.id,
    selector : 'bug-system-type-component',
    templateUrl : 'bug-system-type.component.html'
})

export class BugSystemTypeComponent implements OnInit {
    
    //Events
    @Output('loadingModal') updateLoadingModal = new EventEmitter(); //Event handled by home.component to show and hide the loading widget
    
    displayDialog : boolean;
    bugSystemType:Type = new Type();
    selectedBugSystemType : Type;
    newBugSystemType : boolean;
    bugSystemTypes;
    msgs: Message[] = [];
    bugSystemTypeForm: FormGroup;
    
    // Columns to be displayed in the table
    cols : any[];

    constructor(private bugSystemTypeService: BugSystemTypeService, 
            private alertService: AlertService,
            private formBuilder: FormBuilder) { }

    ngOnInit() {
        // Set up validations
        this.bugSystemTypeForm = this.formBuilder.group({
            'bugSystemTypeId': new FormControl({value: '', disabled: true}),
            'bugSystemTypeName': new FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(100)]))
        });
        
        this.cols = [
                     {field: 'idType', header: 'ID',  styleClass:'idColumn'},
                     {field: 'name', header: 'Name'}
                     ];
    }
    
    /**
     * Returns an observer with the call to load the bugSystem types
     * Observable call object
     */
    loadBugSystemTypes() {
        let bugSystemTypesObservable = this.bugSystemTypeService.getBugSystemTypes();
        bugSystemTypesObservable.subscribe(
            data => { },
            error => {
                this.alertService.error('Failed to load the Bug System Types. ' + error);
            });
        
        return bugSystemTypesObservable;
    }
    
    /**
     * Function used to fill the data in the screen
     * @param bugSystemTypes list of bugSystemTypes to load
     */
    fillData(bugSystemTypes) {
        this.bugSystemTypes = bugSystemTypes;
    }
    
    /**
     *  Display Add/Edit Dialog
     *  @param create: boolean to know if we should display add or edit dialog
     *  @param selectedBugSystemType: selected bugSystem type
     */
    showDialog(create:boolean, selectedBugSystemType:Type) {
        
        // Clear Alerts
        this.alertService.clearAlert();
        this.bugSystemTypeForm.markAsPristine(false);
        
        // Check if a row was selected on edit
        if (!create && !selectedBugSystemType) {
            this.alertService.error('Please select a row');
            return;
        }
        
        this.newBugSystemType = create;
        if (create) {
            this.bugSystemType = new Type();
            this.displayDialog = true;
        } else {
            this.bugSystemType = this.cloneBugSystemType(selectedBugSystemType);
        }
        this.displayDialog = true;
    }
    
    /**
     * Saves a new or old bugSystem Type
     */
    save() {
        // Start the loading widget
        this.showLoadingModal();
        
        // Close the dialog
        this.displayDialog = false;
        
        // Check if it's a new bugSystem type
        if (this.newBugSystemType) {
            this.bugSystemTypeService.createBugSystemType(this.bugSystemType.name)
            .subscribe(
                data => {
                    if (data.error) {
                        this.alertService.error(data.error);
                    } else {
                        this.bugSystemTypes.push(data.body);
                    }
                },
                error => {
                    this.alertService.error('Failed to create Bug System Type. ' + error);
                },
                () => {
                    // Stop the loading widget
                    this.hideLoadingModal();
                });
        } else {
            this.bugSystemTypeService.updateBugSystemType(this.bugSystemType)
            .subscribe(
                data => {
                    if (data.error) {
                        this.alertService.error(data.error);
                    } else {                
                        this.bugSystemTypes[this.findSelectedBugSystemTypeIndex()] = this.bugSystemType;
                    }
                    // Stop the loading widget
                    this.hideLoadingModal();
                },
                error => {
                    this.alertService.error('Failed to update Bug System Type. ' + error);
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
     * Deletes a bugSystem type
     * @param selectedBugSystemType: selected bugSystem type
     */
    deleteBugSystemType(selectedBugSystemType:Type) {
        // Clear Alerts
        this.alertService.clearAlert();
        if (!selectedBugSystemType) {
            this.alertService.error('Please select a row');
            return;
        }
        
        // Start the loading widget
        this.showLoadingModal();
        
        this.bugSystemTypeService.deleteBugSystemType(this.selectedBugSystemType.idType)
        .subscribe(
            data => {
                if (data && data.error) {
                    this.alertService.error(data.error);
                } else {
                    this.bugSystemTypes.splice(this.findSelectedBugSystemTypeIndex(), 1);
                }
            },
            error => {
                this.alertService.error('Failed to delete Bug System Type. ' + error);                   
            },
            () => {
                this.selectedBugSystemType = null;
                // Stop the loading widget
                this.hideLoadingModal();
            });
    }
    
    /**
     * Returns the selected bugSystem type by index
     */
    findSelectedBugSystemTypeIndex(): number {
        return this.bugSystemTypes.indexOf(this.selectedBugSystemType);
    }
    
    /**
     * Closes the Add/Edit dialog
     */
    closeDialog() {
        // Close the dialog
        this.displayDialog = false;
    }
    
    /**
     * Clones a bugSystem type
     * @param bugSystemType bugSystem type to clone
     */
    cloneBugSystemType(bugSystemType: Type): Type {
        let bugSystemTypeToUpdate = new Type();
        for(let prop in bugSystemType) {
            bugSystemTypeToUpdate[prop] = bugSystemType[prop];
        }
        return bugSystemTypeToUpdate;
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
