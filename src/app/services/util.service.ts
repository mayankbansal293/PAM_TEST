import {Injectable} from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class UtilService{
    
    constructor() {}

    formatDate(date) {
        const func = (num) => `${Math.trunc(num / 10)}${Math.trunc(num % 10)}`;
        return func(date.year) + "-" + func(date.month) + "-" + func(date.day);
    }
}