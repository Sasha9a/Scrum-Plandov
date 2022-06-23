import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@scrum/web/core/guards/auth.guard";
import { SprintFormModule } from "@scrum/web/modules/sprint/dumbs/sprint-form/sprint-form.module";
import { SpinnerModule } from "@scrum/web/shared/dumbs/spinner/spinner.module";
import { SprintAddComponent } from './sprint-add.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: SprintAddComponent,
    data: {
      title: 'Создать спринт'
    }
  }
];

@NgModule({
  declarations: [SprintAddComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SprintFormModule,
    SpinnerModule
  ],
})
export class SprintAddModule {}
