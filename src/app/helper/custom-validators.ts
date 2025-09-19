import { AbstractControl, FormGroupDirective, NgForm, ValidationErrors } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

export class CustomFieldErrorMatcher implements ErrorStateMatcher {
    constructor(private customControl: AbstractControl) { }
    isErrorState(control: AbstractControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return this.customControl && (this.customControl.touched || this.customControl.dirty) && this.customControl.invalid;
    }
}