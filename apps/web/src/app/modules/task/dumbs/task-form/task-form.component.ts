import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BaseFormComponent } from "@scrum/web/shared/dumbs/base-form/base-form.component";
import { TaskFormDto } from "@scrum/shared/dtos/task/task.form.dto";
import { BoardDto } from "@scrum/shared/dtos/board/board.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { SprintDto } from "@scrum/shared/dtos/sprint/sprint.dto";
import { TaskPriorityEnum } from "@scrum/shared/enums/task.priority.enum";

@Component({
  selector: 'grace-task-form',
  templateUrl: './task-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskFormComponent extends BaseFormComponent<TaskFormDto> {

  @Input() public task = new TaskFormDto();
  public dto = TaskFormDto;

  @Input() public board: BoardDto;

  @Input() public users: UserDto[];
  @Input() public sprints: SprintDto[];

  public priorities = Object.values(TaskPriorityEnum);

  public override onSave(entity: TaskFormDto) {
    entity.board = this.board;
    super.onSave(entity);
  }
}