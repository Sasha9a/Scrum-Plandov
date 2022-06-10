import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { NestedPropertyPipeModule } from "@scrum/web/shared/pipes/nested-property/nested-property-pipe.module";
import { OrderByPipeModule } from "@scrum/web/shared/pipes/order-by/order-by-pipe.module";
import { DropdownModule } from "primeng/dropdown";
import { SingleSelectComponent } from './single-select.component';

@NgModule({
  declarations: [SingleSelectComponent],
  exports: [SingleSelectComponent],
  imports: [CommonModule, DropdownModule, OrderByPipeModule, FormsModule, NestedPropertyPipeModule]
})
export class SingleSelectModule {}
