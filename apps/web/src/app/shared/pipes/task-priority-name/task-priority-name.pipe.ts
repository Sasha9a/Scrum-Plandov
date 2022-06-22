import { Pipe, PipeTransform } from '@angular/core';
import { TaskPriorityEnum } from "@scrum/shared/enums/task.priority.enum";

const taskPriorityNames: Record<TaskPriorityEnum, string> = {
  [TaskPriorityEnum.HIGHEST]: 'Самый низкий',
  [TaskPriorityEnum.HIGH]: 'Низкий',
  [TaskPriorityEnum.AVERAGE]: 'Средний',
  [TaskPriorityEnum.SHORT]: 'Высокий',
  [TaskPriorityEnum.LOWEST]: 'Самый высокий'
};


@Pipe({
  name: 'taskPriorityName'
})
export class TaskPriorityNamePipe implements PipeTransform {

  public transform(taskPriority: TaskPriorityEnum): string {
    return taskPriorityNames[taskPriority] || '';
  }

}
