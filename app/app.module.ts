import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTableModule, SharedModule, DialogModule, ButtonModule, PanelModule } from 'primeng/primeng';

// Used to create fake backend
import { fakeBackendProvider } from './shared/helpers/fake-backend';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';
 
// Components
import { AppComponent }  from './app.component';
import { AlertComponent } from './shared/alerts/alert.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './user/login.component';
import { RegisterComponent } from './user/register.component';
import { UserTypeComponent }from './user/user-type.component'

// Utils
import { routing } from './routing/app.routing';
import { AuthGuard } from './shared/auth/auth.guard';

// Services
import { AlertService, AuthenticationService, UserService, UserTypeService } from './shared/services/index';
 
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
        NgbModule.forRoot(),
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        UserTypeComponent
    ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        UserTypeService
 
        // providers used to create fake backend
        //fakeBackendProvider,
        //MockBackend,
        //BaseRequestOptions
    ],
    bootstrap: [AppComponent]
})
 
export class AppModule { }