import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { NestedPropertyPipeModule } from "@scrum/web/shared/pipes/nested-property/nested-property-pipe.module";
import { OrderByPipeModule } from "@scrum/web/shared/pipes/order-by/order-by-pipe.module";
import { MultiSelectModule } from "primeng/multiselect";
import { MultiSelectComponent } from './multi-select.component';

@NgModule({
  declarations: [MultiSelectComponent],
  exports: [MultiSelectComponent],
  imports: [CommonModule, MultiSelectModule, OrderByPipeModule, FormsModule, NestedPropertyPipeModule]
})
export class MultiSelectComponentModule {}
