import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@scrum/web/core/guards/auth.guard";
import { SpinnerModule } from "@scrum/web/shared/dumbs/spinner/spinner.module";
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
    TabMenuModule
  ]
})
export class BoardCardModule {}
