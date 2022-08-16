import { ControlContainer } from "@angular/forms";

export class CustomValidators {
    static required(control: ControlContainer) {
        return control.value == '' || (control.value && control.value.trim() == "") ?
            { "required": true } :
            null;
    }
}