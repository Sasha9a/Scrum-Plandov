import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SprintTasksInfoDto } from "@scrum/shared/dtos/sprint/sprint.tasks.info.dto";
import { SprintWorkUserInfoDto } from "@scrum/shared/dtos/sprint/sprint.work.user.info.dto";
import { CrmTableColumn } from "@scrum/web/core/models/crm-table-column";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

@Component({
  selector: 'grace-sprint-work-users-info',
  templateUrl: './sprint-work-users-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SprintWorkUsersInfoComponent {

  public sprint: SprintTasksInfoDto;
  public values: SprintWorkUserInfoDto[];

  public columns: CrmTableColumn[] = [
    { label: 'Исполнитель' },
    { label: 'Запросы' },
    { label: 'Первоначальная оценка времени' },
    { label: 'Оценка оставшегося времени' }
  ];

  public constructor(private readonly config: DynamicDialogConfig) {
    this.sprint = config.data.sprint;
    this.values = [this.sprint.notAssignedInfo, ...this.sprint.usersInfo];
  }

  public toInfo(info: any): SprintWorkUserInfoDto {
    return info as SprintWorkUserInfoDto;
  }

}
