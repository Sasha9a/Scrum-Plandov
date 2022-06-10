import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectComponentModule } from "@scrum/web/shared/dumbs/dropdowns/multi-select/multi-select-component.module";
import { OrderByPipeModule } from "@scrum/web/shared/pipes/order-by/order-by-pipe.module";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { SkeletonModule } from "primeng/skeleton";
import { TableModule } from "primeng/table";
import { TableComponent } from './table.component';

@NgModule({
  declarations: [TableComponent],
  exports: [TableComponent],
  imports: [CommonModule, TableModule, OrderByPipeModule, MultiSelectComponentModule, SkeletonModule, ProgressSpinnerModule]
})
export class TableComponentModule {}
