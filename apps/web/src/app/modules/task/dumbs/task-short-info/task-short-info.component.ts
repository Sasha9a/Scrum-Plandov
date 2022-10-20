import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { JobRecordDto } from '@scrum/shared/dtos/job-record/job.record.dto';
import { TaskDto } from '@scrum/shared/dtos/task/task.dto';
import { JobRecordAddComponent } from '@scrum/web/modules/task/components/job-record/add/job-record-add.component';
import { TaskEditComponent } from '@scrum/web/modules/task/components/task/edit/task-edit.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'grace-task-short-info',
  templateUrl: './task-short-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskShortInfoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public task: TaskDto;
  @Output() public taskChange = new EventEmitter<TaskDto>();

  public visible = false;

  @Output() public updateTasks = new EventEmitter();

  public ref: DynamicDialogRef;

  public constructor(private readonly dialogService: DialogService) {}

  public ngOnInit() {
    if (this.task) {
      this.visible = true;
    }
  }

  public ngOnDestroy() {
    this.ref?.close();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.task?.currentValue) {
      this.visible = true;
    }
  }

  public closeTask() {
    this.task = null;
    this.taskChange.emit(this.task);
  }

  public editTask() {
    this.ref = this.dialogService.open(TaskEditComponent, {
      header: `${this.task?.board?.code}-${this.task?.number}`,
      contentStyle: { overflow: 'auto' },
      styleClass: 'xl:w-4 lg:w-6 md:w-8 sm:w-10 w-full',
      baseZIndex: 99999,
      data: {
        taskId: this.task?._id
      }
    });

    this.ref.onClose.subscribe((res: { task: TaskDto; isDeleted: boolean }) => {
      if (res?.isDeleted) {
        this.visible = false;
        this.closeTask();
      } else if (res?.task) {
        this.task = res.task;
      }
      if (res) {
        this.updateTasks.emit();
      }
    });
  }

  public jobRecord() {
    this.ref = this.dialogService.open(JobRecordAddComponent, {
      header: `Вести журнал работы: ${this.task?.board?.code}-${this.task?.number}`,
      contentStyle: { overflow: 'auto' },
      styleClass: 'xl:w-3 lg:w-6 md:w-7 sm:w-9 w-full',
      baseZIndex: 99999,
      data: {
        task: this.task
      }
    });

    this.ref.onClose.subscribe((jobRecord: JobRecordDto) => {
      if (jobRecord) {
        this.task = jobRecord.task;
        this.updateTasks.emit();
      }
    });
  }
}
