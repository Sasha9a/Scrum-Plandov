import { Pipe, PipeTransform } from '@angular/core';
import { TaskDto } from "@scrum/shared/dtos/task/task.dto";
import { TaskPriorityEnum } from "@scrum/shared/enums/task.priority.enum";

@Pipe({
  name: 'taskOrderBy'
})
export class TaskOrderByPipe implements PipeTransform {

  public transform(tasks: TaskDto[]): TaskDto[] {
    if (!tasks) {
      return [];
    }
    const sortedTasks = [];
    const priorities = Object.values(TaskPriorityEnum);

    for (const priority of priorities) {
      if (tasks?.findIndex((task) => task?.priority === priority) !== -1) {
        sortedTasks.push(...tasks.filter((task) => task.priority === priority).sort((a, b) => a.number < b.number ? -1 : 1));
      }
    }

    return sortedTasks;
  }

}
