import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { TaskDto } from "@scrum/shared/dtos/task/task.dto";

@Component({
  selector: 'grace-task-short-info',
  templateUrl: './task-short-info.component.html',
  styleUrls: ['./task-short-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskShortInfoComponent {

  @Input() public task: TaskDto;
  @Output() public taskChange = new EventEmitter<TaskDto>();

}
