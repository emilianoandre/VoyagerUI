/**
 * Project component that holds the project list
 * @author eandre
 * 
 */
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Message, SelectItem } from 'primeng/primeng';

// Services
import { ProjectService } from '../shared/services/project.service';
import { AlertService } from '../shared/services/alert.service';

// Models
import { Project } from '../shared/models/project'

@Component({
    moduleId : module.id,
    selector : 'project-component',
    templateUrl : 'project.component.html'
})

export class ProjectComponent implements OnInit {
    
  //Events
    @Output('loadingModal') updateLoadingModal = new EventEmitter(); //Event handled by home.component to show and hide the loading widget
    
    displayDialog : boolean;
    project:Project = new Project();
    selectedProject : Project;
    newProject : boolean;
    projects;
    ruleManagers;
    bugSystems;
    ruleManagersList: SelectItem[];
    bugSystemsList: SelectItem[];
    msgs: Message[] = [];
    projectForm: FormGroup;
    
    // Columns to be displayed in the table
    cols : any[];

    constructor(private projectService: ProjectService, 
            private alertService: AlertService,
            private fb: FormBuilder) { }

    ngOnInit() {        
        // Set up validations
        this.projectForm = this.fb.group({
            'projectId': new FormControl({value: '', disabled: true}),
            'name': new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])),
            'ruleManager': new FormControl('', Validators.required),
            'bugSystem': new FormControl('', Validators.required)
        });
        
        this.cols = [
                     {field: 'idProject', header: 'ID',  styleClass:'idColumn'},
                     {field: 'name', header: 'Name'},
                     {field: 'ruleManager.name', header: 'Rule Manager'},
                     {field: 'bugSystem.name', header: 'Bug System'}
                 ];
    }
    
    /**
     * Returns an observer with the call to load the project types
     * Observable call object
     */
    loadProjects() {
        let projectsObservable = this.projectService.getProjects();
        projectsObservable.subscribe(
                data => { },
                error => {
                    this.alertService.error('Failed to load the Projects. ' + error);
                });
        
        return projectsObservable;
    }
    
    /**
     * Function used to fill the data in the screen
     * @param projects list of projects to load
     * @param ruleManagers list of rule managers
     * @param bugSystems list of bug systems
     */
    fillData(projects, ruleManagers, bugSystems) {
        this.projects = projects;
        this.fillBugSystems(bugSystems);
        this.fillRuleManagers(ruleManagers);
    }
    
    /**
     * Function used to fill the bug systems
     * @param bugSystems list of bug systems
     */
    fillBugSystems (bugSystems) {
        this.bugSystems = bugSystems;
        this.bugSystemsList = bugSystems.map(function(bugSystem){return {
            label:bugSystem.name, value:bugSystem};
        });
    }
    
    /**
     * Function used to fill the rule managers
     * @param ruleManagers list of rule managers
     */
    fillRuleManagers (ruleManagers) {
        this.ruleManagers = ruleManagers;
        this.ruleManagersList = ruleManagers.map(function(ruleManager){return {
            label:ruleManager.name, value:ruleManager};
        });
    }
    
    /**
     *  Display Add/Edit Dialog
     *  @param create: boolean to know if we should display add or edit dialog
     *  @param selectedProject: selected project
     */
    showDialog(create:boolean, selectedProject:Project) {
        
        // Clear Alerts
        this.alertService.clearAlert();
        this.projectForm.markAsPristine(false);
        
        // Check if a row was selected on edit
        if (!create && !selectedProject) {
            this.alertService.error('Please select a row');
            return;
        }
        
        this.newProject = create;
        if (create) {
            // Set the default values
            this.project = new Project();
            this.project.bugSystem = this.bugSystems[0];
            this.project.ruleManager = this.ruleManagers[0];
            this.displayDialog = true;
        } else {        
            this.project = this.cloneProject(selectedProject);
        }
        this.displayDialog = true;
    }
    
    /**
     * Saves a new or updates a project
     */
    save() {
        // Start the loading widget
        this.showLoadingModal();
        
        // Check if it's a new project
        if (this.newProject) {
            this.projectService.createProject(this.project)
            .subscribe(
                data => {
                    if (data.error) {
                        this.alertService.error(data.error);
                    } else {
                        this.projects.push(data.body);
                    }
                },
                error => {
                    this.alertService.error('Failed to create Project. ' + error);
                },
                () => {
                    // Stop the loading widget
                    this.hideLoadingModal();
                });
        } else {
            this.projectService.updateProject(this.project)
            .subscribe(
                data => {
                    if (data.error) {
                        this.alertService.error(data.error);
                    } else {                
                        this.projects[this.findSelectedProjectIndex()] = this.project;
                    }
                    // Stop the loading widget
                    this.hideLoadingModal();
                },
                error => {
                    this.alertService.error('Failed to update Project. ' + error);
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
     * Deletes a project
     * @param selectedProject: selected project
     */
    deleteProject(selectedProject:Project) {
        // Clear Alerts
        this.alertService.clearAlert();
        if (!selectedProject) {
            this.alertService.error('Please select a row');
            return;
        }
        
        // Start the loading widget
        this.showLoadingModal();
        
        this.projectService.deleteProject(this.selectedProject.idProject)
        .subscribe(
            data => {
                if (data && data.error) {
                    this.alertService.error(data.error);
                } else {            
                    this.projects.splice(this.findSelectedProjectIndex(), 1);
                }
            },
            error => {
                this.alertService.error('Failed to delete Project. ' + error);                   
            },
            () => {
                this.selectedProject = null;
                // Stop the loading widget
                this.hideLoadingModal();
            });
    }
    
    /**
     * Returns the selected project by index
     */
    findSelectedProjectIndex(): number {
        return this.projects.indexOf(this.selectedProject);
    }
    
    /**
     * Closes the Add/Edit dialog
     */
    closeDialog() {
        // Close the dialog
        this.displayDialog = false;
    }
    
    /**
     * Clones a project
     * @param project project to clone
     */
    cloneProject(project: Project): Project {
        let projectToUpdate = new Project();
        for(let prop in project) {
            projectToUpdate[prop] = project[prop];
        }
        return projectToUpdate;
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
