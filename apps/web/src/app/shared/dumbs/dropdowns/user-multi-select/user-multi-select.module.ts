import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMultiSelectComponent } from './user-multi-select.component';
import {
  MultiSelectComponentModule
} from "@scrum/web/shared/dumbs/dropdowns/multi-select/multi-select-component.module";

@NgModule({
  declarations: [UserMultiSelectComponent],
  exports: [UserMultiSelectComponent],
  imports: [CommonModule, MultiSelectComponentModule]
})
export class UserMultiSelectModule {}
