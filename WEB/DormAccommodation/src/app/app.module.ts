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
import { UserProfileComponent } from './components/user-profile/user-profile.component';

// Routes
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Models
import { User } from './models/user.model';
import { Login } from './models/login.model';
import { HeaderComponent } from './components/header/header.component';
import { Profile } from './models/profile.model';
import { jwtDecode } from 'jwt-decode';
import { HeaderParameterizedComponent } from './components/header-parameterized/header-parameterized.component';



const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuardGuard] },
  { path: 'dosar', component: DormRegistrationPageComponent, canActivate: [authGuardGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [authGuardGuard] },
  { path: 'management', component: ManagementComponent, canActivate: [authGuardGuard] },
  { path: 'user-profile', component: UserProfileComponent, canActivate: [authGuardGuard]},
  { path: '**', redirectTo: '', pathMatch: 'full' }
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AdminComponent,
    ManagementComponent,
    DormRegistrationPageComponent,
    UserProfileComponent,
    HeaderComponent,
    HeaderParameterizedComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    
  ],
  providers: [User, Login, Profile],
  bootstrap: [AppComponent]
})
export class AppModule { }
