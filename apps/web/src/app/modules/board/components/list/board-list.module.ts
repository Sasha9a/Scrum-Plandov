import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@scrum/web/core/guards/auth.guard";
import { TableComponentModule } from "@scrum/web/shared/dumbs/table/table-component.module";
import { ButtonModule } from "primeng/button";
import { BoardListComponent } from './board-list.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: BoardListComponent,
    data: {
      title: 'Доски'
    }
  }
];

@NgModule({
  declarations: [BoardListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TableComponentModule,
    ButtonModule
  ]
})
export class BoardListModule {}
