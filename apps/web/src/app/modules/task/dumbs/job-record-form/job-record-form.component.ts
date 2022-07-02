import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BaseFormComponent } from "@scrum/web/shared/dumbs/base-form/base-form.component";
import { JobRecordFormDto } from "@scrum/shared/dtos/job-record/job.record.form.dto";
import { TaskDto } from "@scrum/shared/dtos/task/task.dto";

@Component({
  selector: 'grace-job-record-form',
  templateUrl: './job-record-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobRecordFormComponent extends BaseFormComponent<JobRecordFormDto> {

  @Input() public jobRecord = new JobRecordFormDto();
  public dto = JobRecordFormDto;

  @Input() public task: TaskDto;

  public override onSave(entity: JobRecordFormDto) {
    if (this.task) {
      entity.task = this.task;
      entity.board = this.task?.board;
      entity.sprint = this.task?.sprint;
    }
    super.onSave(entity);
  }

}
