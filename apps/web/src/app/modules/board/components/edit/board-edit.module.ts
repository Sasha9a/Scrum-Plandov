import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@scrum/web/core/guards/auth.guard";
import { BoardFormModule } from "@scrum/web/modules/board/dumbs/board-form/board-form.module";
import { SpinnerModule } from "@scrum/web/shared/dumbs/spinner/spinner.module";
import { BoardEditComponent } from './board-edit.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: BoardEditComponent
  }
];

@NgModule({
  declarations: [BoardEditComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SpinnerModule,
    BoardFormModule
  ],
})
export class BoardEditModule {}
