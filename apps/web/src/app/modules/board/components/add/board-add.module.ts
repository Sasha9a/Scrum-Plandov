import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { BoardFormModule } from "@scrum/web/modules/board/dumbs/board-form/board-form.module";
import { SpinnerModule } from "@scrum/web/shared/dumbs/spinner/spinner.module";
import { BoardAddComponent } from './board-add.component';

const routes: Routes = [
  {
    path: '',
    component: BoardAddComponent,
    data: {
      title: 'Создать доску'
    }
  }
];

@NgModule({
  declarations: [BoardAddComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SpinnerModule,
    BoardFormModule
  ]
})
export class BoardAddModule {}
