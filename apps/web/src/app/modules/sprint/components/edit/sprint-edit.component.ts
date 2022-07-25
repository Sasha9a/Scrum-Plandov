import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { SprintDto } from "@scrum/shared/dtos/sprint/sprint.dto";
import { SprintFormDto } from "@scrum/shared/dtos/sprint/sprint.form.dto";
import { ConfirmDialogService } from "@scrum/web/core/services/confirm-dialog.service";
import { ErrorService } from "@scrum/web/core/services/error.service";
import { SprintService } from "@scrum/web/core/services/sprint/sprint.service";
import { TitleService } from "@scrum/web/core/services/title.service";

@Component({
  selector: 'grace-sprint-edit',
  templateUrl: './sprint-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SprintEditComponent implements OnInit {

  public sprint: SprintDto;
  public loading = false;

  public constructor(private readonly sprintService: SprintService,
                     private readonly route: ActivatedRoute,
                     private readonly errorService: ErrorService,
                     private readonly titleService: TitleService,
                     private readonly cdRef: ChangeDetectorRef,
                     private readonly router: Router,
                     private readonly confirmService: ConfirmDialogService) {}

  public ngOnInit(): void {
    const sprintId = this.route.snapshot.params.id;

    if (!sprintId) {
      return this.errorService.addCustomError('Ошибка', 'Произошла ошибка, вернитесь на главную и попробуйте снова.');
    }

    this.sprintService.findById<SprintDto>(sprintId).subscribe((data) => {
      this.sprint = data;
      this.loading = false;
      this.titleService.setTitle(`${this.sprint?.name}`);
      this.cdRef.markForCheck();
    });
  }

  public edit(body: SprintFormDto) {
    this.loading = true;
    this.cdRef.markForCheck();

    this.sprintService.update(this.sprint._id, body).subscribe({
      next: () => {
        this.loading = false;
        this.cdRef.markForCheck();
        this.errorService.addSuccessMessage(`Спринт "${body.name}" обновлен`);
        this.router.navigate(['/board/card', this.sprint.board?._id, 'sprint']).catch(console.error);
      },
      error: () => {
        this.loading = false;
        this.cdRef.markForCheck();
      }
    });
  }

  public delete() {
    this.confirmService.confirm({
      message: `Вы действительно хотите удалить спринт "${this.sprint.name}"?`,
      accept: () => {
        this.loading = true;
        this.cdRef.markForCheck();

        this.sprintService.deleteById(this.sprint?._id).subscribe(() => {
          this.loading = false;
          this.cdRef.markForCheck();
          this.errorService.addSuccessMessage(`Спринт "${this.sprint.name}" удален`);
          this.router.navigate(['/board/card', this.sprint.board?._id, 'sprint']).catch(console.error);
        });
      }
    });
  }

}
