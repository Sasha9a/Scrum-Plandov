import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@scrum/web/core/guards/auth.guard";
import { ChangePasswordFormModule } from "@scrum/web/modules/user/dumbs/change-password-form/change-password-form.module";
import { UserEditFormModule } from "@scrum/web/modules/user/dumbs/user-edit-form/user-edit-form.module";
import { UserInfoModule } from "@scrum/web/modules/user/dumbs/user-info/user-info.module";
import { SpinnerModule } from "@scrum/web/shared/dumbs/spinner/spinner.module";
import { TabMenuModule } from "primeng/tabmenu";
import { SettingsComponent } from './settings.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: SettingsComponent
  }
];

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TabMenuModule,
    SpinnerModule,
    UserInfoModule,
    UserEditFormModule,
    ChangePasswordFormModule
  ],
})
export class SettingsModule {}
