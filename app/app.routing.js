"use strict";
var router_1 = require('@angular/router');
//Components
var login_component_1 = require('./user/login.component');
var private_component_1 = require('./private.component');
var appRoutes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: '/home',
        component: private_component_1.PrivateComponent
    },
    {
        path: 'login',
        component: login_component_1.LoginComponent
    }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map