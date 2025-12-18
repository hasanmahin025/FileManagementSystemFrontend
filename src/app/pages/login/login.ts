import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule , Navbar],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginForm!: FormGroup
  isSubmitting = false
  
  //inject

  private authservice = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  //constructor

  constructor() {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  onSubmit(): void {

    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.authservice.login(this.loginForm.value).subscribe({
        next: () => {
          this.isSubmitting = false
          this.router.navigate(['/dashboard'])
        },
        error: (err) => {
          this.isSubmitting = false
          console.error(err)
          alert("Login Failed, Please Check your Username and Password")
        }
      })
    }
    else {
      this.loginForm.markAllAsTouched();
    }

  }





}
