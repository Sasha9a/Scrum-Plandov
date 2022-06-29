import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobRecordAddComponent } from './job-record-add.component';
import { SpinnerModule } from "@scrum/web/shared/dumbs/spinner/spinner.module";
import { JobRecordFormModule } from "@scrum/web/modules/task/dumbs/job-record-form/job-record-form.module";

@NgModule({
  declarations: [JobRecordAddComponent],
  exports: [JobRecordAddComponent],
  imports: [
    CommonModule,
    SpinnerModule,
    JobRecordFormModule
  ]
})
export class JobRecordAddModule {}
