import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { JobRecordFormDto } from '@scrum/shared/dtos/job-record/job.record.form.dto';
import { TaskDto } from '@scrum/shared/dtos/task/task.dto';
import { ErrorService } from '@scrum/web/core/services/error.service';
import { WebsocketTaskService } from '@scrum/web/core/services/task/websocket-task.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'grace-job-record-add',
  templateUrl: './job-record-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobRecordAddComponent {
  public saving = false;
  public task: TaskDto;

  public constructor(
    private readonly config: DynamicDialogConfig,
    private readonly websocketTaskService: WebsocketTaskService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly errorService: ErrorService,
    private readonly ref: DynamicDialogRef
  ) {
    this.task = config.data.task;
  }

  public create(body: JobRecordFormDto) {
    this.saving = true;
    this.cdRef.markForCheck();

    this.websocketTaskService.createJobRecord({ boardId: this.task?.board?._id, body }).subscribe({
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
