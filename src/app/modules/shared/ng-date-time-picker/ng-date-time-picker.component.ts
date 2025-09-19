import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnDestroy, OnInit, Optional, Output, Self, ViewChild } from "@angular/core";
import { ControlValueAccessor, FormsModule, NgControl, ReactiveFormsModule } from "@angular/forms";
import { MatMenuTrigger } from "@angular/material/menu";
import dayjs from 'dayjs/esm';
import utc from 'dayjs/esm/plugin/utc';
import moment from "moment";
import { LocaleConfig, NgxDaterangepickerMd } from "ngx-daterangepicker-material";
// Removed import of TimePeriod as it does not exist in ngx-daterangepicker-material
import { RangeTimePeriod } from "../selected-time-period";
import { MaterialModule } from "app/modules/materials/material.module";
dayjs.extend(utc);

// Define TimePeriod type locally
export interface TimePeriod {
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
}

@Component({
  selector: 'app-ng-date-time-picker',
  templateUrl: './ng-date-time-picker.component.html',
  styleUrls: ['./ng-date-time-picker.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, NgxDaterangepickerMd],
})
export class NgDateTimePickerComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  @Input() placeholder: string = '';
  @Input() locale!: LocaleConfig;
  @Input() timePicker: boolean = true;
  @Input() showRangePicker: boolean = true;
  @Input() showClearButton: boolean = true;
  @Input() timePicker24Hour: boolean = false;
  @Input() joinCalenderInRange: boolean = true;
  @Input() showYearMonthDropdown: boolean = false;
  @Input() autoApply: boolean = false;
  @Input() showLabel: boolean = true;
  @Input() labelText: string = 'Filter by Date';
  @Input() minDate?: string;
  @Input() maxDate?: string;
  @Input() required: boolean = false;
  @Output() onDateSelection: EventEmitter<string | null> = new EventEmitter();
  @Output() onDateRangeSelection: EventEmitter<RangeTimePeriod | null> = new EventEmitter();

  controlValue: any = null;
  selected: { startDate: dayjs.Dayjs; endDate: dayjs.Dayjs } = this.getCurrentDate();
  isFieldDisabled: boolean = false;

  onChange = (value: any) => { }
  onTouched = () => { };

  constructor(@Self() @Optional() public control: NgControl) {
    this.control && (this.control.valueAccessor = this);
  }

  getCurrentDate() {
    return {
      startDate: dayjs(moment().format('YYYY-MM-DDTHH:mmZ')),
      endDate: dayjs(moment().format('YYYY-MM-DDTHH:mmZ')),
    };
  }

  getGivenDates(sDate: any, eDate: any) {
    let start = moment(sDate).format('YYYY-MM-DDTHH:mmZ');
    let end = moment(eDate).format('YYYY-MM-DDTHH:mmZ');
    return {
      startDate: dayjs(start),
      endDate: dayjs(end),
    };
  }

  writeValue(obj: RangeTimePeriod | string): void {
    if (obj) {
      if (this.showRangePicker) {
        let range = (obj as RangeTimePeriod);
        if (!range?.start && !range?.end) {
          return
        }
        this.selected = this.getGivenDates(range.start, range.end);
        this.controlValue = moment(range.start).format(this.locale?.format ?? 'DD/MM/YYYY') + ' - ' + moment(range.end).format(this.locale?.format ?? 'DD/MM/YYYY');
      } else {
        let date = (obj as string);
        if (!date) {
          return
        }
        this.selected = this.getGivenDates(date, date);
        this.controlValue = moment(date).format(this.locale?.format ?? 'DD/MM/YYYY');
      }
    } else {
      this.controlValue = null;
      this.selected = this.getCurrentDate();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isFieldDisabled = isDisabled;
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  public open() {
    this.trigger?.openMenu();
  }

  public close() {
    this.trigger?.closeMenu();
  }

  onDateUpdated(e: TimePeriod): void {
    if (e.startDate && e.endDate) {

      //to show in the input
      if (this.showRangePicker) {
        this.controlValue = e.startDate.format(this.locale?.format ?? 'DD/MM/YYYY') + ' - ' + e.endDate.format(this.locale?.format ?? 'DD/MM/YYYY');
      } else {
        this.controlValue = e.startDate.format(this.locale?.format ?? 'DD/MM/YYYY');
      }

      //to emit the event
      if (this.showRangePicker) {
        let range = { start: e.startDate.toISOString(), end: e.endDate.toISOString() } as RangeTimePeriod;
        this.onDateRangeSelection.emit(range);
        this.onChange(range);
      } else {
        this.onDateSelection.emit(e.startDate.toISOString());
        this.onChange(e.startDate.toISOString());
      }
    } else {
      this.controlValue = null;
      this.selected = this.getCurrentDate();

      //to emit the event when clear button press
      if (this.showRangePicker) {
        this.onDateRangeSelection.emit(null);
        this.onChange(null);
      } else {
        this.onDateSelection.emit(null);
        this.onChange(null);
      }
    }
    this.onTouched();
    this.close();
  }
}