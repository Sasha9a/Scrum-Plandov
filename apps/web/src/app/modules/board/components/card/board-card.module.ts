import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@scrum/web/core/guards/auth.guard";
import { SpinnerModule } from "@scrum/web/shared/dumbs/spinner/spinner.module";
import { TaskFilterPipe } from "@scrum/web/shared/pipes/task-filter/task-filter.pipe";
import { TabMenuModule } from "primeng/tabmenu";
import { BoardCardComponent } from './board-card.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard'
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: BoardCardComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/board-dashboard.module').then(m => m.BoardDashboardModule)
      },
      {
        path: 'sprint',
        loadChildren: () => import('./sprint/board-sprint.module').then(m => m.BoardSprintModule)
      },
      {
        path: 'report',
        loadChildren: () => import('./report/board-report.module').then(m => m.BoardReportModule)
      }
    ]
  }
];

@NgModule({
  declarations: [BoardCardComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		SpinnerModule,
		TabMenuModule
	],
  providers: [TaskFilterPipe]
})
export class BoardCardModule {}
