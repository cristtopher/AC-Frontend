import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { SharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';
import { AdminModule } from './admin/admin.module';

import { AppRoutingModule } from './app-routing.module';

import { AUTH_PROVIDERS } from 'angular2-jwt';
import { USER_PROVIDERS } from './shared/user/user.providers';
import { PERSON_PROVIDERS } from './shared/person/person.providers';


import { CanActivateAuthGuard } from './shared/auth/auth-guard.service';
import { AuthService } from './shared/auth/auth.service';
import { SocketService } from './shared/socket/socket.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';


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
    AdminModule,
    AppRoutingModule
  ],
  providers: [
    AUTH_PROVIDERS,
    AuthService,
    SocketService,
    USER_PROVIDERS,
    PERSON_PROVIDERS,
    CanActivateAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
