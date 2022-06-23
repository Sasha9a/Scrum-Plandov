import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@scrum/web/core/guards/auth.guard";
import { SprintFormModule } from "@scrum/web/modules/sprint/dumbs/sprint-form/sprint-form.module";
import { SpinnerModule } from "@scrum/web/shared/dumbs/spinner/spinner.module";
import { SprintEditComponent } from './sprint-edit.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: SprintEditComponent
  }
];

@NgModule({
  declarations: [SprintEditComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SpinnerModule,
    SprintFormModule
  ],
})
export class SprintEditModule {}
