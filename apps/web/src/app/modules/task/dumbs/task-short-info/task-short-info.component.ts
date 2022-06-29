import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { TaskDto } from "@scrum/shared/dtos/task/task.dto";
import { TaskEditComponent } from "@scrum/web/modules/task/components/edit/task-edit.component";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";

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

  public constructor(private readonly dialogService: DialogService) {
  }

  public ngOnInit() {
    if (this.task) {
      this.visible = true;
    }
  }

  public ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
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
      contentStyle: { 'overflow': 'auto' },
      styleClass: 'xl:w-4 lg:w-6 md:w-8 sm:w-10 w-full',
      baseZIndex: 99999,
      data: {
        taskId: this.task?._id
      }
    });

    this.ref.onClose.subscribe((res: { task: TaskDto, isDeleted: boolean }) => {
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

}
