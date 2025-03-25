import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//Guard
import { authGuardGuard } from '../Guard/auth-guard.guard';

// Usefull
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

// Components
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { ManagementComponent } from './components/management/management.component';
import { DormRegistrationPageComponent } from './components/dorm-registration-page/dorm-registration-page.component';

// Routes
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuardGuard] },
  { path: 'dosar', component: DormRegistrationPageComponent, canActivate: [authGuardGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [authGuardGuard] },
  { path: 'management', component: ManagementComponent, canActivate: [authGuardGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AdminComponent,
    ManagementComponent,
    DormRegistrationPageComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
