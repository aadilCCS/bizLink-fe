import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Optional, Output, Self, SimpleChanges } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormsModule, NgControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';
import { MaterialModule } from '../../materials/material.module';
import { DROPDOWN_TYPE } from '../../../enums/form-enum';
import { CustomFieldErrorMatcher } from '../../../helper/custom-validators';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

/**
 * In order to use this dropdown please follow these steps -- 
 * 
 * By default dropdown type is simple i.e without search,
 * if you want to use search feature than pass **[dropdownType]="DROPDOWN_TYPE.SEARCH"** in selector
 * 
 * This dropdown accepts ARRAY OF OBJECTS in each object pass  **name** key like this -->
 * 
 * **{ name : 'value you want to display in dropdown' }** ,
 * 
 * If you don't pass the **name** key in the object than it is mandatory to pass [optionViewKey] in the selector 
 * and the value of **[optionViewKey]** will your one of the object value to whom you want to optionViewKey in the dropdown, 
 * and **search query will be based on [optionViewKey]**.
 * 
 * If you want your selected value in different format then pass **[outputPattern]="['value', 'id']" 
 * example when you selected **hail hydra** in your dropdown, this will result like { value : 'hail hydra', id : '' }.
 * Most important **outputPattern** value should be available in **options**
 * 
 *
 */

@Component({
	selector: 'search-dropdown',
	standalone: true,
	imports: [CommonModule, MaterialModule, ReactiveFormsModule, FormsModule, NgxMatSelectSearchModule],
	templateUrl: './search-dropdown.component.html',
	styleUrls: ['./search-dropdown.component.scss']
})
export class SearchDropdownComponent implements ControlValueAccessor, OnChanges, AfterViewInit {
	@Input() fieldLabel!: string;
	@Input() placeholder!: string;
	@Input() options: Array<any> = [];
	@Input() selectedOptions: any;
	@Input() dropdownType: DROPDOWN_TYPE = DROPDOWN_TYPE.SIMPLE;
	@Input() outputPattern: any[] = [];
	@Input() optionViewKey: string = 'name';
	@Input() showAllOption: boolean = false;
	@Input() multipleSelection: boolean = false;

	@Output() changeEvent = new EventEmitter<object | string>()

	stateMatcher!: ErrorStateMatcher
	DROPDOWN_TYPE = DROPDOWN_TYPE

	initialValue!: any;
	isFieldDisabled: boolean = false;
	isFieldRequired: boolean | undefined = false;

	filteredOptions: any[] = [];
	multiselectValue: string[] = [];

	constructor(@Self() @Optional() public control: NgControl) {
		this.control && (this.control.valueAccessor = this);
	}

	updateForm = (value: any) => { }

	onTouched = () => { };

	closedMatSelect() {
		this.filteredOptions = this.options;
	}

	matSearchClear() {
		this.filteredOptions = this.options;
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['options']) this.filteredOptions = this.options
		if (changes['selectedOptions']) this.writeValue(this.selectedOptions)

	}

	setDisabledState(isDisabled: boolean): void {
		this.isFieldDisabled = isDisabled;
	}

	writeValue(defaultValue: any): void {
		this.initialValue = defaultValue;
		if (!defaultValue) return;

		this.onTouched();

		if (this.options && this.options.length) {
			this.setUpData(defaultValue);
		} else {
			const interval = setInterval(() => {
				if (this.options && this.options.length) {
					this.setUpData(defaultValue);
					clearInterval(interval);
				}
			}, 500);
		}
	}

	setUpData(defaultValue: any) {
		this.options.forEach((element: any) => {
			if (this.multipleSelection) {
				if (defaultValue?.length) {
					const initData = this.options.filter((e: any) => defaultValue.includes(e.id));
					this.initialValue = initData.map((e: any) => { return e[this.optionViewKey] });
				}
			} else {
				// default value is string or number 
				const optionValues = Object.values(element)
				optionValues.includes(defaultValue) ? this.initialValue = element[this.optionViewKey] : null

				// in some cases type of default value is object...
				if (typeof defaultValue === 'object') {
					const defaultValueKey = Object.keys(defaultValue)
					defaultValueKey.includes(this.optionViewKey) ? this.initialValue = defaultValue[this.optionViewKey] : null
				}
			}

		});
	}

	registerOnChange(fn: any): void { this.updateForm = fn }
	registerOnTouched(fn: any): void { this.onTouched = fn }

	searchHandler(event: any) {
		let searchKey = event.target.value
		if (searchKey) {
			this.filteredOptions = this.options.filter((el: any) => {
				if (el[this.optionViewKey].toLowerCase().includes(searchKey.toLowerCase())) {
					return el
				}
			});
		} else {
			this.filteredOptions = this.options;
		}
	}

	supplyFinalResult(processedResult: any) {
		this.updateForm(processedResult)
		this.changeEvent.next(processedResult)
	}

	generateDpResult(e: MatSelectChange) {
		if (!e.value) {
			this.supplyFinalResult(null)
			this.updateForm(null)
			return;
		}

		if (this.multipleSelection) {
			if (this.outputPattern?.length) {
				const selectedOptions = this.options.filter((el: any) => e.value.includes(el[this.optionViewKey]));
				const ids = selectedOptions.map((e: any) => { return e.id });
				this.supplyFinalResult(ids);
				this.updateForm(ids);
			} else {
				this.supplyFinalResult([]);
				this.updateForm([]);
			}
			return;
		}

		const [selected] = this.options.filter((el: any) => el[this.optionViewKey] === e.value)
		this.onTouched()

		if (!this.outputPattern.length) {
			this.supplyFinalResult(e.value)
			this.updateForm(e.value)
			return
		}

		// this will result in object if you pass outputPattern in selector
		const result: any = {}
		const patternList = [...this.outputPattern]
		const modifiedPattern = typeof patternList[1] === 'object' ? patternList.slice(0, 1) : patternList

		modifiedPattern.forEach((pattern: string) => {
			selected[pattern] && (result[pattern] = selected[pattern])
		})

		if (typeof patternList[1] === 'object') {
			this.supplyFinalResult(result)
			return
		}

		if (modifiedPattern.length === 1) this.supplyFinalResult(result[modifiedPattern[0]])
		else this.supplyFinalResult(result)
	}

	ngAfterViewInit(): void {
		const timer = setTimeout(() => {
			if (this.control) {
				this.stateMatcher = new CustomFieldErrorMatcher(this.control.control as AbstractControl);
				this.isFieldRequired = this.control?.control?.hasValidator(Validators.required);
				clearTimeout(timer)
			}
		}, 100)
	}
}
