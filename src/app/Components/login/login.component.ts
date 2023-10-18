import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  baseUrl: any;

  LoginForm!: FormGroup;
  user!: any;
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,) { }

  ngOnInit(): void {
    this.baseUrl= environment.apiUrl;

    this.LoginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  Login() {

    this.http.post(this.baseUrl+'/login', this.LoginForm.value).subscribe(
      response => {
        console.log(response);
        this.user = response;
        localStorage.setItem("userDetails", JSON.stringify(this.user));
        if (this.user.user.roles[0] == 'Recruiter') {
          this.router.navigate(['/recruiter'])
        } else if (this.user.user.roles[0] == 'Review1') {
          this.router.navigate(['/review'])
        } else if (this.user.user.roles[0] == 'Review2') {
          this.router.navigate(['/review2'])
        } else if (this.user.user.roles[0] == 'Admin') {
          this.router.navigate(['/admin'])
        }
      },
      error => {
        alert(error.error.errorMessage);
      }
    );
  }

}
