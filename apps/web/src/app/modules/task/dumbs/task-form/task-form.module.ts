import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderModule } from "@scrum/web/shared/dumbs/file-uploader/file-uploader.module";
import { FileModule } from "@scrum/web/shared/dumbs/file/file.module";
import { TaskFormComponent } from './task-form.component';
import {InputTextModule} from "primeng/inputtext";
import { JoinPipeModule } from "@scrum/web/shared/pipes/join/join-pipe.module";
import { FormsModule } from "@angular/forms";
import { GoBackButtonModule } from "@scrum/web/shared/dumbs/go-back-button/go-back-button.module";
import { ButtonModule } from "primeng/button";
import { InputTextareaModule } from "primeng/inputtextarea";
import { SingleSelectModule } from "@scrum/web/shared/dumbs/dropdowns/single-select/single-select.module";
import { TaskPriorityNamePipeModule } from "@scrum/web/shared/pipes/task-priority-name/task-priority-name-pipe.module";
import { InputNumberModule } from "primeng/inputnumber";
import { EditorModule } from "primeng/editor";

@NgModule({
  declarations: [TaskFormComponent],
  exports: [TaskFormComponent],
  imports: [
    CommonModule,
    InputTextModule,
    JoinPipeModule,
    FormsModule,
    GoBackButtonModule,
    ButtonModule,
    InputTextareaModule,
    SingleSelectModule,
    TaskPriorityNamePipeModule,
    InputNumberModule,
    EditorModule,
    FileModule,
    FileUploaderModule
  ]
})
export class TaskFormModule {}
