import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { JoinPipeModule } from "@scrum/web/shared/pipes/join/join-pipe.module";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { RecoveryFormComponent } from './recovery-form.component';

@NgModule({
  declarations: [RecoveryFormComponent],
  exports: [RecoveryFormComponent],
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, JoinPipeModule]
})
export class RecoveryFormModule {}
