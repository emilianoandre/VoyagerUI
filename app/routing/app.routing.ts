/**
 * Main routing file
 * @author eandre
 */
import { Routes, RouterModule } from '@angular/router';
 
import { HomeComponent } from '../home/home.component';
import { LoginComponent } from '../user/login.component';
import { RegisterComponent } from '../user/register.component';
import { AuthGuard } from '../shared/auth/auth.guard';
 
const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
 
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];
 
export const routing = RouterModule.forRoot(appRoutes);