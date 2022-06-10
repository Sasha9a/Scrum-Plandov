import { ErrorHandler, NgModule } from "@angular/core";
import { CommonModule, DecimalPipe } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "@scrum/web/core/app.component";
import { GlobalErrorHandler } from "@scrum/web/core/services/error-handler.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ScrollTopModule } from "primeng/scrolltop";
import { ToastModule } from "primeng/toast";

const routes: Routes = [
  {
    path: ''
  }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    ToastModule,
    ConfirmDialogModule,
    ScrollTopModule,
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'ignore',
      scrollPositionRestoration: 'enabled'
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
