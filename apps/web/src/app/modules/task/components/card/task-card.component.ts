import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { TaskDto } from "@scrum/shared/dtos/task/task.dto";
import { ErrorService } from "@scrum/web/core/services/error.service";
import { TaskService } from "@scrum/web/core/services/task/task.service";
import { TitleService } from "@scrum/web/core/services/title.service";

@Component({
  selector: 'grace-task-card',
  templateUrl: './task-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCardComponent implements OnInit {

  public task: TaskDto;
  public loading = true;

  public constructor(private readonly taskService: TaskService,
                     private readonly route: ActivatedRoute,
                     private readonly errorService: ErrorService,
                     private readonly cdRef: ChangeDetectorRef,
                     private readonly titleService: TitleService) {}

  public ngOnInit(): void {
    const taskId = this.route.snapshot.params.id;

    if (!taskId) {
      return this.errorService.addCustomError('Ошибка', 'Произошла ошибка, вернитесь на главную и попробуйте снова.');
    }

    this.taskService.findById<TaskDto>(taskId).subscribe((task) => {
      this.task = task;
      this.loading = false;
      this.titleService.setTitle(`[${this.task?.board?.code}-${this.task?.number}] ${this.task?.name}`);
      this.cdRef.markForCheck();
    });
  }
}
