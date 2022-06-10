import { CommonModule, registerLocaleData } from "@angular/common";
import { LOCALE_ID, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CoreModule } from "@scrum/web/core/core.module";
import { ErrorInterceptor } from "@scrum/web/core/interceptors/error.interceptor";
import { TokenInterceptor } from "@scrum/web/core/interceptors/token.interceptor";
import moment from "moment-timezone";
import localeRu from '@angular/common/locales/ru';

import { AppComponent } from './core/app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

registerLocaleData(localeRu, 'ru');
moment.locale('ru');

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule
  ],
  providers: [
    [{ provide: LOCALE_ID, useValue: 'ru-RU' }],
    [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
    [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }]
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
