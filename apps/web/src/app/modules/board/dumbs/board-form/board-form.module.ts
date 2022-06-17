import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { GoBackButtonModule } from "@scrum/web/shared/dumbs/go-back-button/go-back-button.module";
import { TableComponentModule } from "@scrum/web/shared/dumbs/table/table-component.module";
import { JoinPipeModule } from "@scrum/web/shared/pipes/join/join-pipe.module";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ButtonModule } from "primeng/button";
import { ColorPickerModule } from "primeng/colorpicker";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { BoardFormComponent } from './board-form.component';

@NgModule({
  declarations: [BoardFormComponent],
  exports: [BoardFormComponent],
  imports: [
    CommonModule,
    ButtonModule,
    GoBackButtonModule,
    InputTextModule,
    JoinPipeModule,
    FormsModule,
    AutoCompleteModule,
    TableComponentModule,
    TableModule,
    ColorPickerModule
  ]
})
export class BoardFormModule {}
