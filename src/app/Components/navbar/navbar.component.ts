import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  baseUrl:any;

  getreviewerDetails: any;
  reviewerDetails: any;
  userId: any;
  role:any;
  constructor(private route: ActivatedRoute,private router: Router,private httpClient: HttpClient) { }

  ngOnInit() {

    this.baseUrl= environment.apiUrl;

    this.getreviewerDetails = localStorage.getItem('userDetails');
    this.reviewerDetails = JSON.parse(this.getreviewerDetails);
    this.userId = this.reviewerDetails.user._id;
  }

  logout(){
    this.router.navigate([''],);
  }

  checkRoles(accessRole:any){
    this.role=accessRole;
    this.httpClient.get<any>(this.baseUrl+`/checkRoles/${this.userId}/${this.role}`).subscribe(
      response => {
        console.log(response);
        if(this.role=='Recruiter'){
          this.router.navigate(['/recruiter'])
        }else if(this.role=='Review1'){
          this.router.navigate(['/review'])
        }else if(this.role=='Review2'){
          this.router.navigate(['/review2'])
        }else if(this.role=='Admin'){
          this.router.navigate(['/admin'])
        }
      },
      error =>{
        alert("You Don't have permission for this. ")
        console.log(error.error.message);
      }
    );
  }

}
