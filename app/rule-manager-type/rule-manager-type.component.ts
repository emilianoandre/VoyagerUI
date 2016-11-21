/**
 * ruleManager Type component that holds the ruleManager type list
 * @author eandre
 * 
 */
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder, FormsModule } from '@angular/forms';
import { Message, SelectItem } from 'primeng/primeng';

// Services
import { RuleManagerTypeService } from '../shared/services/rule-manager-type.service';
import { AlertService } from '../shared/services/alert.service';

// Models
import { Type } from '../shared/models/type'

@Component({
    moduleId : module.id,
    selector : 'rule-manager-type-component',
    templateUrl : 'rule-manager-type.component.html'
})

export class RuleManagerTypeComponent implements OnInit {
    
    //Events
    @Output('loadingModal') updateLoadingModal = new EventEmitter(); //Event handled by home.component to show and hide the loading widget
    displayDialog : boolean;
    ruleManagerType:Type = new Type();
    selectedRuleManagerType : Type;
    newRuleManagerType : boolean;
    ruleManagerTypes;
    msgs: Message[] = [];
    ruleManagerTypeForm: FormGroup;    
    submitted: boolean;
    
    // Columns to be displayed in the table
    cols : any[];

    constructor(private ruleManagerTypeService: RuleManagerTypeService, 
            private alertService: AlertService,
            private formBuilder: FormBuilder) { }

    ngOnInit() {
        // Set up validations
        this.ruleManagerTypeForm = this.formBuilder.group({
            'ruleManagerTypeId': new FormControl({value: '', disabled: true}),
            'ruleManagerTypeName': new FormControl('', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(100)]))
        });
        
        this.cols = [
                     {field: 'idType', header: 'ID',  styleClass:'idColumn'},
                     {field: 'name', header: 'Name'}
                     ];
    }
    
    /**
     * Returns an observer with the call to load the ruleManager types
     * Observable call object
     */
    loadRuleManagerTypes() {
        let ruleManagerTypeObservable = this.ruleManagerTypeService.getRuleManagerTypes();
        ruleManagerTypeObservable.subscribe(
            data => { },
            error => {
                this.alertService.error('Failed to load the Rule Manager Types. ' + error);
            });
        
        return ruleManagerTypeObservable;
    }
    
    /**
     * Function used to fill the data in the screen
     * @param ruleManagerTypes list of ruleManagerTypes to load
     */
    fillData(ruleManagerTypes) {
        this.ruleManagerTypes = ruleManagerTypes;
    }
    
    /**
     * Get the message from the Add/Edit form
     */
    get diagnostic() { 
        return JSON.stringify(this.ruleManagerTypeForm.value);        
    }
    
    /**
     *  Display Add/Edit Dialog
     *  @param create: boolean to know if we should display add or edit dialog
     *  @param selectedRuleManagerType: selected ruleManager type
     */
    showDialog(create:boolean, selectedRuleManagerType:Type) {
        
        // Clear Alerts
        this.alertService.clearAlert();
        this.ruleManagerTypeForm.markAsPristine(false);
        
        // Check if a row was selected on edit
        if (!create && !selectedRuleManagerType) {
            this.alertService.error('Please select a row');
            return;
        }
        
        this.newRuleManagerType = create;
        if (create) {
            this.ruleManagerType = new Type();
            this.displayDialog = true;
        } else {
            this.ruleManagerType = this.cloneRuleManagerType(selectedRuleManagerType);
        }
        this.displayDialog = true;
    }
    
    /**
     * Saves a new or old ruleManager Type
     */
    save() {
        // Start the loading widget
        this.showLoadingModal();
        
        // Close the dialog
        this.displayDialog = false;
        
        // Check if it's a new ruleManager type
        if (this.newRuleManagerType) {
            this.ruleManagerTypeService.createRuleManagerType(this.ruleManagerType.name)
            .subscribe(
                data => {
                    if (data.error) {
                        this.alertService.error(data.error);
                    } else {
                        this.ruleManagerTypes.push(data.body);
                    }
                },
                error => {
                    this.alertService.error('Failed to create Rule Manager Type. ' + error);
                },
                () => {
                    // Stop the loading widget
                    this.hideLoadingModal();
                });
        } else {
            this.ruleManagerTypeService.updateRuleManagerType(this.ruleManagerType)
            .subscribe(
                data => {
                    if (data.error) {
                        this.alertService.error(data.error);
                    } else {                
                        this.ruleManagerTypes[this.findSelectedRuleManagerTypeIndex()] = this.ruleManagerType;
                    }
                    // Stop the loading widget
                    this.hideLoadingModal();
                },
                error => {
                    this.alertService.error('Failed to update Rule Manager Type. ' + error);
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
     * Deletes a ruleManager type
     * @param selectedRuleManagerType: selected ruleManager type
     */
    deleteRuleManagerType(selectedRuleManagerType:Type) {
        // Clear Alerts
        this.alertService.clearAlert();
        if (!selectedRuleManagerType) {
            this.alertService.error('Please select a row');
            return;
        }
        
        // Start the loading widget
        this.showLoadingModal();
        
        this.ruleManagerTypeService.deleteRuleManagerType(this.selectedRuleManagerType.idType)
        .subscribe(
            data => {
                if (data && data.error) {
                    this.alertService.error(data.error);
                } else {
                    this.ruleManagerTypes.splice(this.findSelectedRuleManagerTypeIndex(), 1);
                }
            },
            error => {
                this.alertService.error('Failed to delete Rule Manager Type. ' + error);                   
            },
            () => {
                // Stop the loading widget
                this.hideLoadingModal();
            });
    }
    
    /**
     * Returns the selected ruleManager type by index
     */
    findSelectedRuleManagerTypeIndex(): number {
        return this.ruleManagerTypes.indexOf(this.selectedRuleManagerType);
    }
    
    /**
     * Closes the Add/Edit dialog
     */
    closeDialog() {
     // Close the dialog
        this.displayDialog = false;
    }
    
    /**
     * Clones a ruleManager type
     * @param ruleManagerType ruleManager type to clone
     */
    cloneRuleManagerType(ruleManagerType: Type): Type {
        let ruleManagerTypeToUpdate = new Type();
        for(let prop in ruleManagerType) {
            ruleManagerTypeToUpdate[prop] = ruleManagerType[prop];
        }
        return ruleManagerTypeToUpdate;
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
