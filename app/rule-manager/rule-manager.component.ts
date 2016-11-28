/**
 * RuleManager component that holds the ruleManager list
 * @author eandre
 * 
 */
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Message, SelectItem } from 'primeng/primeng';

// Services
import { RuleManagerService } from '../shared/services/rule-manager.service';
import { AlertService } from '../shared/services/alert.service';

// Models
import { RuleManager } from '../shared/models/rule-manager'

@Component({
    moduleId : module.id,
    selector : 'rule-manager-component',
    templateUrl : 'rule-manager.component.html'
})

export class RuleManagerComponent implements OnInit {
    
  //Events
    @Output('loadingModal') updateLoadingModal = new EventEmitter(); //Event handled by home.component to show and hide the loading widget
    
    displayDialog : boolean;
    ruleManager:RuleManager = new RuleManager();
    selectedRuleManager : RuleManager;
    newRuleManager : boolean;
    ruleManagers;
    ruleManagerTypes;
    ruleManagerTypesList: SelectItem[];
    msgs: Message[] = [];
    ruleManagerForm: FormGroup;
    
    // Columns to be displayed in the table
    cols : any[];

    constructor(private ruleManagerService: RuleManagerService, 
            private alertService: AlertService,
            private fb: FormBuilder) { }

    ngOnInit() {        
        // Set up validations
        this.ruleManagerForm = this.fb.group({
            'ruleManagerId': new FormControl({value: '', disabled: true}),
            'name': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])),
            'url': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(200)])),
            'ruleManagerType': new FormControl('', Validators.required)
        });
        
        this.cols = [
                     {field: 'idRuleManager', header: 'ID',  styleClass:'idColumn'},
                     {field: 'name', header: 'Name'},
                     {field: 'url', header: 'URL'},
                     {field: 'ruleManagerType.name', header: 'RuleManager Type'}
                 ];
    }
    
    /**
     * Returns an observer with the call to load the ruleManager types
     * Observable call object
     */
    loadRuleManagers() {
        let ruleManagersObservable = this.ruleManagerService.getRuleManagers();
        ruleManagersObservable.subscribe(
                data => { },
                error => {
                    this.alertService.error('Failed to load the RuleManagers. ' + error);
                });
        
        return ruleManagersObservable;
    }
    
    /**
     * Function used to fill the data in the screen
     * @param ruleManagers list of ruleManagers to load
     * @param ruleManagerTypes list of ruleManager types
     */
    fillData(ruleManagers, ruleManagerTypes) {
        this.ruleManagers = ruleManagers;
        this.ruleManagerTypes = ruleManagerTypes;
        this.ruleManagerTypesList = ruleManagerTypes.map(function(ruleManagerType){return {
            label:ruleManagerType.name, value:ruleManagerType};
        });
    }
    
    /**
     *  Display Add/Edit Dialog
     *  @param create: boolean to know if we should display add or edit dialog
     *  @param selectedRuleManager: selected ruleManager
     */
    showDialog(create:boolean, selectedRuleManager:RuleManager) {
        
        // Clear Alerts
        this.alertService.clearAlert();
        this.ruleManagerForm.markAsPristine(false);
        
        // Check if a row was selected on edit
        if (!create && !selectedRuleManager) {
            this.alertService.error('Please select a row');
            return;
        }
        
        this.newRuleManager = create;
        if (create) {
            // Set the default values
            this.ruleManager = new RuleManager();
            this.ruleManager.ruleManagerType = this.ruleManagerTypes[0];
            
            this.displayDialog = true;
        } else {        
            this.ruleManager = this.cloneRuleManager(selectedRuleManager);
        }
        this.displayDialog = true;
    }
    
    /**
     * Saves a new or updates a ruleManager
     */
    save() {
        // Start the loading widget
        this.showLoadingModal();
        
        // Check if it's a new ruleManager
        if (this.newRuleManager) {
            this.ruleManagerService.createRuleManager(this.ruleManager)
            .subscribe(
                data => {
                    if (data.error) {
                        this.alertService.error(data.error);
                    } else {
                        this.ruleManagers.push(data.body);
                    }
                },
                error => {
                    this.alertService.error('Failed to create RuleManager. ' + error);
                },
                () => {
                    // Stop the loading widget
                    this.hideLoadingModal();
                });
        } else {
            this.ruleManagerService.updateRuleManager(this.ruleManager)
            .subscribe(
                data => {
                    if (data.error) {
                        this.alertService.error(data.error);
                    } else {                
                        this.ruleManagers[this.findSelectedRuleManagerIndex()] = this.ruleManager;
                    }
                    // Stop the loading widget
                    this.hideLoadingModal();
                },
                error => {
                    this.alertService.error('Failed to update RuleManager. ' + error);
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
     * Deletes a ruleManager
     * @param selectedRuleManager: selected ruleManager
     */
    deleteRuleManager(selectedRuleManager:RuleManager) {
        // Clear Alerts
        this.alertService.clearAlert();
        if (!selectedRuleManager) {
            this.alertService.error('Please select a row');
            return;
        }
        
        // Start the loading widget
        this.showLoadingModal();
        
        this.ruleManagerService.deleteRuleManager(this.selectedRuleManager.idRuleManager)
        .subscribe(
            data => {
                if (data && data.error) {
                    this.alertService.error(data.error);
                } else {            
                    this.ruleManagers.splice(this.findSelectedRuleManagerIndex(), 1);
                }
            },
            error => {
                this.alertService.error('Failed to delete RuleManager. ' + error);                   
            },
            () => {
                this.selectedRuleManager = null;
                // Stop the loading widget
                this.hideLoadingModal();
            });
    }
    
    /**
     * Returns the selected ruleManager by index
     */
    findSelectedRuleManagerIndex(): number {
        return this.ruleManagers.indexOf(this.selectedRuleManager);
    }
    
    /**
     * Closes the Add/Edit dialog
     */
    closeDialog() {
        // Close the dialog
        this.displayDialog = false;
    }
    
    /**
     * Clones a ruleManager
     * @param ruleManager ruleManager to clone
     */
    cloneRuleManager(ruleManager: RuleManager): RuleManager {
        let ruleManagerToUpdate = new RuleManager();
        for(let prop in ruleManager) {
            ruleManagerToUpdate[prop] = ruleManager[prop];
        }
        return ruleManagerToUpdate;
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
