import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleEnum } from '@scrum/shared/enums/role.enum';
import { AuthGuard } from '@scrum/web/core/guards/auth.guard';
import { RoleGuard } from '@scrum/web/core/guards/role.guard';
import { AdminUserListComponent } from '@scrum/web/modules/admin/components/user-list/admin-user-list.component';
import { TableComponentModule } from '@scrum/web/shared/dumbs/table/table-component.module';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, RoleGuard],
    component: AdminUserListComponent,
    data: {
      title: 'Список пользователей',
      roles: [RoleEnum.SUPERADMIN],
      included: true
    }
  }
];

@NgModule({
  declarations: [AdminUserListComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TableComponentModule]
})
export class AdminUserListModule {}
