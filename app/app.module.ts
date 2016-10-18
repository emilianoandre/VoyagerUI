import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';
 
// used to create fake backend
import { fakeBackendProvider } from './shared/helpers/fake-backend';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';
 
import { AppComponent }  from './app.component';
import { routing }        from './routing/app.routing';
 
import { AlertComponent } from './shared/alerts/alert.component';
import { AuthGuard } from './shared/auth/auth.guard';
import { AlertService, AuthenticationService, UserService } from './shared/services/index';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './user/login.component';
import { RegisterComponent } from './user/register.component';
 
@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent
    ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
 
        // providers used to create fake backend
        fakeBackendProvider,
        MockBackend,
        BaseRequestOptions
    ],
    bootstrap: [AppComponent]
})
 
export class AppModule { }