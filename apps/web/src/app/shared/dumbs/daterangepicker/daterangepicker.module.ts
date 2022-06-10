import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DaterangepickerComponent } from './daterangepicker.component';

@NgModule({
  declarations: [DaterangepickerComponent],
  exports: [DaterangepickerComponent],
  imports: [CommonModule, CalendarModule, FormsModule]
})
export class DaterangepickerModule {}
