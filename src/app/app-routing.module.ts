import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { RecruiterComponent } from './Components/recruiter/recruiter.component';
import { ReviewComponent } from './Components/review/review.component';
import { Review2Component } from './Components/review2/review2.component';
import { AdminComponent } from './Components/admin/admin.component';
import { EditReviewComponent } from './Components/edit-review/edit-review.component';

const routes: Routes = [

  { path: '', component: LoginComponent },
  { path: 'recruiter', component: RecruiterComponent },
  { path: 'review', component: ReviewComponent },
  { path: 'review2', component: Review2Component },
  { path: 'admin', component: AdminComponent },
  { path: 'editReview', component: EditReviewComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
