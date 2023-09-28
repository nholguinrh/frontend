import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';

import { FormControl } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

import * as moment from 'moment';
import { Moment } from 'moment';

export const CUSTOM_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MMMM',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'MMM YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'smc-custom-datepicker',
  templateUrl: './custom-datepicker.component.html',
  styleUrls: ['./custom-datepicker.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_FORMATS },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomDatepickerComponent {

  @Output() clickReturn = new EventEmitter();
  
  dateControl: FormControl = new FormControl(moment());

  @Input() set date(val: Date) {
    this.dateControl.setValue(val);
  }
  fecha = new Date();
  fechaActual = new Date(
    this.fecha.getFullYear(),
    this.fecha.getMonth()
      );
  get date(): Date {
    return this.dateControl.value;
  }

  private _startView: 'multi-year' | 'month' | 'year' = 'month';
  @Input() set startView(view: 'multi-year' | 'month' | 'year') {
    this._startView = view;
  }
  get startView() {
    return this._startView;
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.dateControl.value;
    ctrlValue.year(normalizedYear.year());
    this.dateControl.setValue(ctrlValue);
  }

  chosenMonthHandler(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.dateControl.value;
    ctrlValue.month(normalizedMonth.month());
    this.dateControl.setValue(ctrlValue);
    datepicker.close();
    this.clickReturn.emit();
  }
}
