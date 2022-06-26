import { Pipe, PipeTransform } from '@angular/core';
import { TaskDto } from "@scrum/shared/dtos/task/task.dto";

@Pipe({
  name: 'taskFilter'
})
export class TaskFilterPipe implements PipeTransform {

  public transform(tasks: TaskDto[], filters: string[]): TaskDto[] {
    if (!tasks) {
      return [];
    }
    if (!filters || !filters?.length) {
      return tasks;
    }
    return tasks.filter((task) => filters.some((filter) => filter === task.executor?._id));
  }

}
