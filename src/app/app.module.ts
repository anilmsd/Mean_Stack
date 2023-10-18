import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient ,HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './Components/login/login.component';
import { RecruiterComponent } from './Components/recruiter/recruiter.component';
import { ReviewComponent } from './Components/review/review.component';
import { Review2Component } from './Components/review2/review2.component';
import { AdminComponent } from './Components/admin/admin.component';
import { EditReviewComponent } from './Components/edit-review/edit-review.component';
import { NavbarComponent } from './Components/navbar/navbar.component';

import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RecruiterComponent,
    ReviewComponent,
    Review2Component,
    AdminComponent,
    EditReviewComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
