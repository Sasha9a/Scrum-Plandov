import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './main-page.component';
import { RouterModule, Routes } from "@angular/router";
import { CardModule } from "primeng/card";
import { ImageModule } from "primeng/image";
import { ButtonModule } from "primeng/button";

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    data: {
      title: 'Главная'
    }
  }
];

@NgModule({
  declarations: [MainPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CardModule,
    ImageModule,
    ButtonModule
  ]
})
export class MainPageModule {}
