import { Pipe, PipeTransform } from '@angular/core';
import { TaskPriorityEnum } from "@scrum/shared/enums/task.priority.enum";

const taskPriorityColor: Record<TaskPriorityEnum, string> = {
  [TaskPriorityEnum.HIGHEST]: '#999999',
  [TaskPriorityEnum.HIGH]: '#707070',
  [TaskPriorityEnum.AVERAGE]: '#f79232',
  [TaskPriorityEnum.SHORT]: '#f15c75',
  [TaskPriorityEnum.LOWEST]: '#d04437'
};

@Pipe({
  name: 'taskPriorityColor'
})
export class TaskPriorityColorPipe implements PipeTransform {

  public transform(taskPriority: TaskPriorityEnum): string {
    return taskPriorityColor[taskPriority] || '';
  }

}
