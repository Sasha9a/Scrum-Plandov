import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskDto } from '@scrum/shared/dtos/task/task.dto';

@Component({
  selector: 'scrum-task-multi-select',
  templateUrl: './task-multi-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskMultiSelectComponent {
  @Input() public tasks: TaskDto[] = [];

  @Input() public selectedTasks: TaskDto[] = [];
  @Output() public selectedTasksChange = new EventEmitter<TaskDto[]>();

  @Input() public labelInput = false;

  public toTask(task: any): TaskDto {
    return task as TaskDto;
  }
}
