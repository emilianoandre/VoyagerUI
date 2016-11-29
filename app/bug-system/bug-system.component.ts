/**
 * BugSystem component that holds the bugSystem list
 * @author eandre
 * 
 */
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Message, SelectItem } from 'primeng/primeng';

// Services
import { BugSystemService } from '../shared/services/bug-system.service';
import { AlertService } from '../shared/services/alert.service';

// Models
import { BugSystem } from '../shared/models/bug-system'

@Component({
    moduleId : module.id,
    selector : 'bug-system-component',
    templateUrl : 'bug-system.component.html'
})

export class BugSystemComponent implements OnInit {
    
  //Events
    @Output('loadingModal') updateLoadingModal = new EventEmitter(); //Event handled by home.component to show and hide the loading widget
    @Output('updateData') updateData = new EventEmitter(); //Event handled by home.component to update data in other tabs
    
    displayDialog : boolean;
    bugSystem:BugSystem = new BugSystem();
    selectedBugSystem : BugSystem;
    newBugSystem : boolean;
    bugSystems;
    bugSystemTypes;
    bugSystemTypesList: SelectItem[];
    msgs: Message[] = [];
    bugSystemForm: FormGroup;
    
    // Columns to be displayed in the table
    cols : any[];

    constructor(private bugSystemService: BugSystemService, 
            private alertService: AlertService,
            private fb: FormBuilder) { }

    ngOnInit() {        
        // Set up validations
        this.bugSystemForm = this.fb.group({
            'bugSystemId': new FormControl({value: '', disabled: true}),
            'name': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])),
            'url': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(200)])),
            'bugSystemType': new FormControl('', Validators.required)
        });
        
        this.cols = [
                     {field: 'idBugSystem', header: 'ID',  styleClass:'idColumn'},
                     {field: 'name', header: 'Name'},
                     {field: 'url', header: 'URL'},
                     {field: 'bugSystemType.name', header: 'BugSystem Type'}
                 ];
    }
    
    /**
     * Returns an observer with the call to load the bugSystem types
     * Observable call object
     */
    loadBugSystems() {
        let bugSystemsObservable = this.bugSystemService.getBugSystems();
        bugSystemsObservable.subscribe(
                data => { },
                error => {
                    this.alertService.error('Failed to load the BugSystems. ' + error);
                });
        
        return bugSystemsObservable;
    }
    
    /**
     * Function used to fill the data in the screen
     * @param bugSystems list of bugSystems to load
     * @param bugSystemTypes list of bugSystem types
     */
    fillData(bugSystems, bugSystemTypes) {
        this.bugSystems = bugSystems;
        this.fillBugSystemTypes(bugSystemTypes);
    }
    
    /**
     * Function used to fill the bug system types
     * @param bugSystemTypes list of bug system types
     */
    fillBugSystemTypes (bugSystemTypes) {
        this.bugSystemTypes = bugSystemTypes;
        this.bugSystemTypesList = bugSystemTypes.map(function(bugSystemType){return {
            label:bugSystemType.name, value:bugSystemType};
        });
    }
    
    /**
     *  Display Add/Edit Dialog
     *  @param create: boolean to know if we should display add or edit dialog
     *  @param selectedBugSystem: selected bugSystem
     */
    showDialog(create:boolean, selectedBugSystem:BugSystem) {
        
        // Clear Alerts
        this.alertService.clearAlert();
        this.bugSystemForm.markAsPristine(false);
        
        // Check if a row was selected on edit
        if (!create && !selectedBugSystem) {
            this.alertService.error('Please select a row');
            return;
        }
        
        this.newBugSystem = create;
        if (create) {
            // Set the default values
            this.bugSystem = new BugSystem();
            this.bugSystem.bugSystemType = this.bugSystemTypes[0];
            this.displayDialog = true;
        } else {        
            this.bugSystem = this.cloneBugSystem(selectedBugSystem);
        }
        this.displayDialog = true;
    }
    
    /**
     * Saves a new or updates a bugSystem
     */
    save() {
        // Start the loading widget
        this.showLoadingModal();
        
        // Check if it's a new bugSystem
        if (this.newBugSystem) {
            this.bugSystemService.createBugSystem(this.bugSystem)
            .subscribe(
                data => {
                    if (data.error) {
                        this.alertService.error(data.error);
                    } else {
                        this.bugSystems.push(data.body);
                        this.updateBugSystems();
                    }
                },
                error => {
                    this.alertService.error('Failed to create BugSystem. ' + error);
                },
                () => {
                    // Stop the loading widget
                    this.hideLoadingModal();
                });
        } else {
            this.bugSystemService.updateBugSystem(this.bugSystem)
            .subscribe(
                data => {
                    if (data.error) {
                        this.alertService.error(data.error);
                    } else {                
                        this.bugSystems[this.findSelectedBugSystemIndex()] = this.bugSystem;
                        this.updateBugSystems();
                    }
                    // Stop the loading widget
                    this.hideLoadingModal();
                },
                error => {
                    this.alertService.error('Failed to update BugSystem. ' + error);
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
     * Deletes a bugSystem
     * @param selectedBugSystem: selected bugSystem
     */
    deleteBugSystem(selectedBugSystem:BugSystem) {
        // Clear Alerts
        this.alertService.clearAlert();
        if (!selectedBugSystem) {
            this.alertService.error('Please select a row');
            return;
        }
        
        // Start the loading widget
        this.showLoadingModal();
        
        this.bugSystemService.deleteBugSystem(this.selectedBugSystem.idBugSystem)
        .subscribe(
            data => {
                if (data && data.error) {
                    this.alertService.error(data.error);
                } else {            
                    this.bugSystems.splice(this.findSelectedBugSystemIndex(), 1);
                    this.updateBugSystems();
                }
            },
            error => {
                this.alertService.error('Failed to delete BugSystem. ' + error);                   
            },
            () => {
                this.selectedBugSystem = null;
                // Stop the loading widget
                this.hideLoadingModal();
            });
    }
    
    /**
     * Returns the selected bugSystem by index
     */
    findSelectedBugSystemIndex(): number {
        return this.bugSystems.indexOf(this.selectedBugSystem);
    }
    
    /**
     * Closes the Add/Edit dialog
     */
    closeDialog() {
        // Close the dialog
        this.displayDialog = false;
    }
    
    /**
     * Clones a bugSystem
     * @param bugSystem bugSystem to clone
     */
    cloneBugSystem(bugSystem: BugSystem): BugSystem {
        let bugSystemToUpdate = new BugSystem();
        for(let prop in bugSystem) {
            bugSystemToUpdate[prop] = bugSystem[prop];
        }
        return bugSystemToUpdate;
    }
    
    /**
     * Function used to update other forms data with the changes to bug systems
     */
    private updateBugSystems() {
        this.updateData.emit(this.bugSystems);
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
