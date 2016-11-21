import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTableModule, SharedModule, DialogModule, ButtonModule, PanelModule,
    PasswordModule, TabViewModule, DropdownModule } from 'primeng/primeng';

// Used to create fake backend
import { fakeBackendProvider } from './shared/helpers/fake-backend';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';
 
// Components
import { AppComponent }  from './app.component';
import { AlertComponent } from './shared/alerts/alert.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserTypeComponent }from './user-type/user-type.component';
import { UserComponent }from './user/user.component';
import { BugSystemTypeComponent } from './bug-system-type/bug-system-type.component';
import { RuleManagerTypeComponent } from './rule-manager-type/rule-manager-type.component';
import { PermissionComponent } from './permission/permission.component';

// Utils
import { routing } from './routing/app.routing';
import { AuthGuard } from './shared/auth/auth.guard';

// Services
import { AlertService, AuthenticationService, UserService, UserTypeService, BugSystemTypeService, 
    RuleManagerTypeService, PermissionService } from './shared/services/index';
 
@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        routing,
        DataTableModule,
        DialogModule,
        ButtonModule,
        PanelModule,
        PasswordModule,
        NgbModule.forRoot(),
        TabViewModule,
        DropdownModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        UserTypeComponent,
        UserComponent,
        BugSystemTypeComponent,
        RuleManagerTypeComponent,
        PermissionComponent
    ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        UserTypeService,
        BugSystemTypeService,
        RuleManagerTypeService,
        PermissionService
        // providers used to create fake backend
        //fakeBackendProvider,
        //MockBackend,
        //BaseRequestOptions
    ],
    bootstrap: [AppComponent]
})
 
export class AppModule { }