import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { MainPageComponent } from './main-page.component';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    data: {
      title: 'Главная',
      onlyNotAuth: true
    }
  }
];

@NgModule({
  declarations: [MainPageComponent],
  imports: [CommonModule, RouterModule.forChild(routes), CardModule, ImageModule, ButtonModule]
})
export class MainPageModule {}
