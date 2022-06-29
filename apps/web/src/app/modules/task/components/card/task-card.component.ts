import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { TaskDto } from "@scrum/shared/dtos/task/task.dto";
import { ErrorService } from "@scrum/web/core/services/error.service";
import { TaskService } from "@scrum/web/core/services/task/task.service";
import { TitleService } from "@scrum/web/core/services/title.service";
import { TaskEditComponent } from "@scrum/web/modules/task/components/edit/task-edit.component";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";

@Component({
  selector: 'grace-task-card',
  templateUrl: './task-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCardComponent implements OnInit, OnDestroy {

  public task: TaskDto;
  public taskId: string;
  public loading = true;

  public ref: DynamicDialogRef;

  public constructor(private readonly taskService: TaskService,
                     private readonly route: ActivatedRoute,
                     private readonly router: Router,
                     private readonly errorService: ErrorService,
                     private readonly cdRef: ChangeDetectorRef,
                     private readonly titleService: TitleService,
                     private readonly dialogService: DialogService) {}

  public ngOnInit(): void {
    this.taskId = this.route.snapshot.params.id;

    if (!this.taskId) {
      return this.errorService.addCustomError('Ошибка', 'Произошла ошибка, вернитесь на главную и попробуйте снова.');
    }

    this.load();
  }

  public load() {
    this.taskService.findById<TaskDto>(this.taskId).subscribe((task) => {
      this.task = task;
      this.loading = false;
      this.titleService.setTitle(`[${this.task?.board?.code}-${this.task?.number}] ${this.task?.name}`);
      this.cdRef.markForCheck();
    });
  }

  public ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
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
        this.router.navigate(['/board/card/' + res?.task?.board?._id]).catch(console.error);
      } else if (res?.task) {
        this.load();
      }
    });
  }

}
