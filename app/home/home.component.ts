/**
 * Home Component
 * @author eandre
 */
import { Component, OnInit } from '@angular/core';
 
import { User } from '../user/user';
import { UserService } from '../shared/services/user.service';
 
@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})
 
export class HomeComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
    
    cars: any[];
    cols: any[];
 
    constructor(private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
 
    ngOnInit() {
        this.loadAllUsers();
        this.cars = [];
        for (let i=0; i<25; i++) {
            this.cars.push({ 'vin':'something', 
                    'year':'somethingelse', 
                    'brand': 'test',
                    'color': 'red'
                  });
        }
        this.cols = [
            {field: 'vin', header: 'Vin'},
            {field: 'year', header: 'Year'},
            {field: 'brand', header: 'Brand'},
            {field: 'color', header: 'Color'}
        ];
    }
 
    deleteUser(id) {
        this.userService.delete(id).subscribe(() => { this.loadAllUsers() });
    }
 
    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }
}