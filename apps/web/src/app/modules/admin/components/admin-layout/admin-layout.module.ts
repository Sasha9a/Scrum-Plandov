import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@scrum/web/core/guards/auth.guard';
import { AdminLayoutComponent } from '@scrum/web/modules/admin/components/admin-layout/admin-layout.component';
import { TabMenuModule } from 'primeng/tabmenu';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'user/list'
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: AdminLayoutComponent,
    children: [
      {
        path: 'user/list',
        loadChildren: () => import('../user-list/admin-user-list.module').then((m) => m.AdminUserListModule)
      }
    ]
  }
];

@NgModule({
  declarations: [AdminLayoutComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TabMenuModule]
})
export class AdminLayoutModule {}
