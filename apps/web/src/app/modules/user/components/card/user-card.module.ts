import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@scrum/web/core/guards/auth.guard";
import { UserInfoModule } from "@scrum/web/modules/user/dumbs/user-info/user-info.module";
import { SpinnerModule } from "@scrum/web/shared/dumbs/spinner/spinner.module";
import { UserCardComponent } from './user-card.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: UserCardComponent
  }
];

@NgModule({
  declarations: [UserCardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SpinnerModule,
    UserInfoModule
  ]
})
export class UserCardModule {}
