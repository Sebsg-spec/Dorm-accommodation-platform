import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//Guard
import { authGuardGuard } from '../Guard/auth-guard.guard';

// Usefull
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

// Components
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { ManagementComponent } from './components/management/management.component';
import { DormRegistrationPageComponent } from './components/dorm-registration-page/dorm-registration-page.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ApplicationDetailsComponent } from './components/application-details/application-details.component';

// Routes
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Models
import { User } from './models/user.model';
import { Login } from './models/login.model';
import { HeaderComponent } from './components/header/header.component';
import { Profile } from './models/profile.model';
// import { jwtDecode } from 'jwt-decode';
import { HeaderParameterizedComponent } from './components/header-parameterized/header-parameterized.component';
import { JwtInterceptor } from './utils/jwt.interceptor';
import { ApplicationCardComponent } from './components/application-card/application-card.component';
import { ApplicationUpdateComponent } from './components/application-update/application-update.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {MatButton} from '@angular/material/button';



const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuardGuard] },
  { path: 'dosar', component: DormRegistrationPageComponent, canActivate: [authGuardGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [authGuardGuard] },
  { path: 'admin-home', component: AdminHomeComponent, canActivate: [authGuardGuard] },
  { path: 'management', component: ManagementComponent, canActivate: [authGuardGuard] },
  { path: 'user-profile', component: UserProfileComponent, canActivate: [authGuardGuard]},
  { path: 'application-details/:id', component: ApplicationDetailsComponent, canActivate: [authGuardGuard]},
  { path: 'application-update/:id', component: ApplicationUpdateComponent, canActivate: [authGuardGuard]},
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
    HeaderParameterizedComponent,
    ApplicationCardComponent,
    ApplicationDetailsComponent,
    ApplicationUpdateComponent,
    AdminHomeComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormField,
    MatDatepickerToggle,
    MatDatepicker,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatButton,
    MatSuffix,
    MatLabel,
    MatButton,
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatFormField,
    MatLabel,
    MatInput,
    MatDatepickerInput,
  ],
  providers: [User, Login, Profile,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
