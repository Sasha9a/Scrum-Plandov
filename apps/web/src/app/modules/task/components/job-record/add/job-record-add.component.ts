import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { TaskDto } from "@scrum/shared/dtos/task/task.dto";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { JobRecordService } from "@scrum/web/core/services/job-record/job-record.service";
import { JobRecordFormDto } from "@scrum/shared/dtos/job-record/job.record.form.dto";
import { JobRecordDto } from "@scrum/shared/dtos/job-record/job.record.dto";
import { ErrorService } from "@scrum/web/core/services/error.service";

@Component({
  selector: 'grace-job-record-add',
  templateUrl: './job-record-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobRecordAddComponent {

  public saving = false;
  public task: TaskDto;

  public constructor(private readonly config: DynamicDialogConfig,
                     private readonly jobRecordService: JobRecordService,
                     private readonly cdRef: ChangeDetectorRef,
                     private readonly errorService: ErrorService,
                     private readonly ref: DynamicDialogRef) {
    this.task = config.data.task;
  }

  public create(body: JobRecordFormDto) {
    this.saving = true;
    this.cdRef.markForCheck();

    this.jobRecordService.create<JobRecordFormDto, JobRecordDto>(body).subscribe({
      next: (jobRecord) => {
        this.saving = false;
        this.cdRef.markForCheck();
        this.errorService.addSuccessMessage('Работа записана');
        this.ref.close(jobRecord);
      },
      error: () => {
        this.saving = false;
        this.cdRef.markForCheck();
      }
    });
  }

}
