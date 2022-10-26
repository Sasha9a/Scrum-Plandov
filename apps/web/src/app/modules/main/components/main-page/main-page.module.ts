import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsAuthGuard } from '@scrum/web/core/guards/is-auth.guard';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { MainPageComponent } from './main-page.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [IsAuthGuard],
    component: MainPageComponent,
    data: {
      title: 'Главная'
    }
  }
];

@NgModule({
  declarations: [MainPageComponent],
  imports: [CommonModule, RouterModule.forChild(routes), CardModule, ImageModule, ButtonModule]
})
export class MainPageModule {}
