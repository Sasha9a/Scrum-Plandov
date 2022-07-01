import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@scrum/web/core/guards/auth.guard";
import { BoardDashboardModule } from "@scrum/web/modules/board/components/card/dashboard/board-dashboard.module";
import { BoardReportModule } from "@scrum/web/modules/board/components/card/report/board-report.module";
import { BoardSprintModule } from "@scrum/web/modules/board/components/card/sprint/board-sprint.module";
import { SpinnerModule } from "@scrum/web/shared/dumbs/spinner/spinner.module";
import { TaskFilterPipe } from "@scrum/web/shared/pipes/task-filter/task-filter.pipe";
import { TabMenuModule } from "primeng/tabmenu";
import { BoardCardComponent } from './board-card.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: BoardCardComponent
  }
];

@NgModule({
  declarations: [BoardCardComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		SpinnerModule,
		TabMenuModule,
		BoardDashboardModule,
		BoardSprintModule,
		BoardReportModule
	],
  providers: [TaskFilterPipe]
})
export class BoardCardModule {}
