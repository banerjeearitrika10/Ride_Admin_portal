// angular import
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

// project import
import { AppComponent } from './app.component';
import { SharedModule } from './components/shared/shared.module';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AuthLayoutComponent } from './components/layout/app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './components/layout/app-layout/main-layout/main-layout.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { PageLoaderComponent } from './components/layout/page-loader/page-loader.component';
import { AvatarComponent } from './components/shared/components/avatar/avatar.component';
import { RightSidebarComponent } from './components/layout/right-sidebar/right-sidebar.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { GlobalSpinnerComponent } from './components/global-spinner/global-spinner.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CoreModule } from './components/core/core.module';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { GlobalSpinnerInterceptor } from './components/global-spinner/global-spinner.interceptor';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageLoaderComponent,
    SidebarComponent,
    RightSidebarComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    AvatarComponent,
    GlobalSpinnerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgScrollbarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    LoadingBarRouterModule,
    // core & shared
    CoreModule,
    SharedModule,
    NgxMatTimepickerModule
  ],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // fakeBackendProvider,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: GlobalSpinnerInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
