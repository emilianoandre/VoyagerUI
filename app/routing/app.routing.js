"use strict";
/**
 * Main routing file
 * @author eandre
 */
var router_1 = require('@angular/router');
var home_component_1 = require('../home/home.component');
var login_component_1 = require('../user/login.component');
var register_component_1 = require('../user/register.component');
var auth_guard_1 = require('../shared/auth/auth.guard');
var appRoutes = [
    { path: '', component: home_component_1.HomeComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'register', component: register_component_1.RegisterComponent },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map