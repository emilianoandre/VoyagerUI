/**
 * User Type component that holds the user type list
 * @author eandre
 * 
 */
import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector    : 'user-type-list',
    templateUrl: 'user-type.component.html'
})

export class UserTypeComponent implements OnInit {
    
    displayDialog: boolean;
    car:any = new PrimeCar();    
    selectedCar: any;    
    newCar: boolean;
    cars: any[];
    cols: any[];

    constructor() { }

    ngOnInit() {
        this.cars = [];
        for (let i=0; i<25; i++) {
            this.cars.push({ 'vin':'something' + i, 
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
    
    showDialogToAdd() {
        this.newCar = true;
        this.car = new PrimeCar();
        this.displayDialog = true;
    }
    
    save() {
        if (this.newCar) {
            this.cars.push(this.car);
        } else {
            this.cars[this.findSelectedCarIndex()] = this.car;
        }
        
        this.car = null;
        this.displayDialog = false;
    }
    
    delete() {
        this.cars.splice(this.findSelectedCarIndex(), 1);
        this.car = null;
        this.displayDialog = false;
    }    
    
    onRowSelect(event) {
        this.newCar = false;
        this.car = this.cloneCar(event.data);
        this.displayDialog = true;
    }
    
    cloneCar(c: PrimeCar): PrimeCar {
        let car = new PrimeCar();
        for(let prop in c) {
            car[prop] = c[prop];
        }
        return car;
    }
    
    findSelectedCarIndex(): number {
        return this.cars.indexOf(this.selectedCar);
    }
}

class PrimeCar {
    
    constructor(public vin?, public year?, public brand?, public color?) {}
}