import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { TaskDto } from "@scrum/shared/dtos/task/task.dto";

@Component({
  selector: 'grace-task-short-info',
  templateUrl: './task-short-info.component.html',
  styleUrls: ['./task-short-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskShortInfoComponent implements OnInit, OnChanges {

  @Input() public task: TaskDto;
  @Output() public taskChange = new EventEmitter<TaskDto>();

  public visible = false;

  public ngOnInit() {
    if (this.task) {
      this.visible = true;
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

}
