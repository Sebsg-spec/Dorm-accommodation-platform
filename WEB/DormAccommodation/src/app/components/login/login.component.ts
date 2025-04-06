import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {Router} from '@angular/router';
import {LoginService} from '../../../services/login.service';
import {User} from '../../models/user.model';
import {Login} from '../../models/login.model';
import {ProfileService} from '../../../services/profile.service';
import {Profile} from '../../models/profile.model';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent?.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginObj: any = {
    Email: '',
    FullName: '',
    Account_Id: 0,
    Result: false,
    Message: ''
  }

  registerObj: any = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  }
  registerForm: FormGroup;

  loginForm: FormGroup;

  matcher = new MyErrorStateMatcher();

  username: string = "";

  canAcces: string = "";

  form!: FormGroup;
  errorMessage!: string

  constructor(private http: HttpClient, private router: Router, private formBuilder: FormBuilder, private Login: LoginService, private Profile: ProfileService, private User: User, private login: Login) {

    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {validator: this.checkPasswords});

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
  }

  checkPasswords(group: FormGroup) {
    let pass = group.controls['password'].value;
    let confirmPass = group.controls['confirmPassword'].value;

    return pass === confirmPass ? null : {notSame: true}
  }

  ngOnInit(): void {

    const container: HTMLElement | null = document.getElementById('container');
    const registerBtn: HTMLElement | null = document.getElementById('register');
    const loginBtn: HTMLElement | null = document.getElementById('login');


    if (container && registerBtn && loginBtn) {
      registerBtn.addEventListener('click', () => {
        container.classList.add("active");
      });

      loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
      });
    } else {
      console.error('One or more elements not found.');
    }

  }


  onLogIn(): any {
    this.login.email = this.loginForm.controls['email'].value;
    this.login.password = this.loginForm.controls['password'].value;


    this.Login.login(this.login).subscribe({
      next: (response: any) => {
        if (response.token) {
          sessionStorage.setItem("Key", response.token);
          sessionStorage.setItem("email", this.login.email);
          this.redirect();

        } else {
          this.canAcces = "false";
          sessionStorage.setItem('canAcces', this.canAcces);
        }
      },
      error: (err) => {
        this.canAcces = "false";
        sessionStorage.setItem('canAcces', this.canAcces);
        alert("Parola sau e-mailul sunt incorecte!")
      }
    });
  }

  redirect(): any {
    const pin = sessionStorage.getItem("Key")
    const id = this.Profile.getUserIdFromToken(pin);
    this.Profile.getProfile(id!).subscribe((response: Profile) => {
      this.canAcces = "true";
      sessionStorage.setItem('canAcces', this.canAcces);
      if (response.pin) {
        this.router.navigateByUrl('home');
      } else {

        this.router.navigateByUrl('user-profile');
      }
    })

  }

  onRegister(): any {

    if (this.registerForm.valid) {
      this.User.first_name = this.registerForm.controls['firstName'].value;
      this.User.last_name = this.registerForm.controls['lastName'].value;
      this.User.email = this.registerForm.controls['email'].value;
      this.User.password = this.registerForm.controls['password'].value;

      this.Login.register(this.User).subscribe({
        next: (response: any) => {

          if (response.token) {
            sessionStorage.setItem("Key", response.token);
            this.router.navigateByUrl('user-profile')

            this.canAcces = "true";
            sessionStorage.setItem('canAcces', this.canAcces)


          } else {
            this.canAcces = "false";
            sessionStorage.setItem('canAcces', this.canAcces);
          }
        },
        error: (err) => {
          this.canAcces = "false";
          sessionStorage.setItem('canAcces', this.canAcces);

          alert("Cont deja existent")

          const container: HTMLElement | null = document.getElementById('container');
          if (container) {
            container.classList.remove("active");
          }

          this.registerForm.reset();

        }
      })
    }
  }
}




