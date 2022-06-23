import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: 'add',
    loadChildren: () => import('./components/add/sprint-add.module').then(m => m.SprintAddModule)
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./components/edit/sprint-edit.module').then(m => m.SprintEditModule)
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SprintModule { }
