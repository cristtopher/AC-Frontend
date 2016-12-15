import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { HomeModule } from './home/home.module';
import { AppRoutingModule } from './app-routing.module';

import { AUTH_PROVIDERS } from 'angular2-jwt';
import { USER_PROVIDERS } from './shared/user/user.service';

import { CanActivateAuthGuard } from './shared/auth/auth-guard.service';
import { AuthService } from './shared/auth/auth.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HomeModule,
    AppRoutingModule
  ],
  providers: [
    AUTH_PROVIDERS,
    AuthService,
    USER_PROVIDERS,
    CanActivateAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
