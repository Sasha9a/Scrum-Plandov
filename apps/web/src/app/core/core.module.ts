import { ErrorHandler, NgModule } from "@angular/core";
import { CommonModule, DecimalPipe } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "@scrum/web/core/app.component";
import { GlobalErrorHandler } from "@scrum/web/core/services/error-handler.service";
import { CommonLayoutComponent } from "@scrum/web/shared/layouts/common-layout/common-layout.component";
import { CommonLayoutModule } from "@scrum/web/shared/layouts/common-layout/common-layout.module";
import { SocketIoModule } from "ngx-socket-io";
import { ConfirmationService, MessageService } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ScrollTopModule } from "primeng/scrolltop";
import { ToastModule } from "primeng/toast";

const routes: Routes = [
  {
    path: '',
    component: CommonLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../modules/main/main.module').then(m => m.MainModule)
      },
      {
        path: 'user',
        loadChildren: () => import('../modules/user/user.module').then(m => m.UserModule)
      },
      {
        path: 'board',
        loadChildren: () => import('../modules/board/board.module').then(m => m.BoardModule)
      },
      {
        path: 'sprint',
        loadChildren: () => import('../modules/sprint/sprint.module').then(m => m.SprintModule)
      },
      {
        path: 'task',
        loadChildren: () => import('../modules/task/task.module').then(m => m.TaskModule)
      }
    ]
  }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    ToastModule,
    ConfirmDialogModule,
    ScrollTopModule,
    CommonLayoutModule,
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'ignore',
      scrollPositionRestoration: 'enabled',
      paramsInheritanceStrategy: 'always'
    }),
    SocketIoModule.forRoot({
      url: 'http://localhost:3333'
    })
  ],
  providers: [
    MessageService,
    ConfirmationService,
    DecimalPipe,
    [{ provide: ErrorHandler, useClass: GlobalErrorHandler }]
  ],
  exports: [RouterModule]
})
export class CoreModule { }
