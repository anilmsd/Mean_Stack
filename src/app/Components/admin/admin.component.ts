import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  reviewer2Responses: any;
  // reviewer1Responses: any;
  // userResponses: any;
  userData: any;
  baseUrl:any;
  showAdminTableFlag: boolean = true;
  showReviewersCountFlag: boolean = false;
  formattedResponses = []; // Initialize with your data









  constructor(private httpClient: HttpClient , private route: ActivatedRoute,private router: Router) { }

  ngOnInit() {
  this.baseUrl= environment.apiUrl;

    this.httpClient.get(this.baseUrl+'/getAllReviewsForAdmin').subscribe(
      (response: any) => {
        console.log(response);
        this.reviewer2Responses = response.formattedResponses;
        this.formattedResponses = response.formattedResponses;

        ;
      },
      error => {
        alert(error.error.errorMessage);
      }
    );
  }
  showAdminTable() {
    this.showAdminTableFlag = true;
    this.showReviewersCountFlag = false;
  }

  showReviewersCount() {
    this.showAdminTableFlag = false;
    this.showReviewersCountFlag = true;
  }

  fromDate!: string;
  toDate!: string;
  
  onSubmit() {
    console.log(this.fromDate , this.toDate);
    const url = this.baseUrl+`/reviewsCount?fromDate=${this.fromDate}&toDate=${this.toDate}`;

    this.httpClient.get(url).subscribe(
      (response: any) => {
        console.log(response);
        this.userData = response.userData;
      },
      error => {
        alert(error.error.errorMessage);
      }
    );
  }

  viewReview(userResponseId:any , reviewer1ResponseId:any , reviewer2ResponseId:any ,indexValue:any){

    this.router.navigate(['editReview'], {
      queryParams: { userResponseId: btoa(String(userResponseId)), reviewer1ResponseId:btoa(reviewer1ResponseId), reviewer2ResponseId: btoa(String(reviewer2ResponseId)),indexValue:btoa(indexValue) },
    });

  }

 

  p: number = 1;
  pagecount:number=5;
  searchQuery='';

  changepagecount(){
    console.log("testing")
    this.p=1;
  }

   //search users
   search() {

    if (this.searchQuery == "") {
      this.ngOnInit();
    } else {
      console.log("hi")
      this.reviewer2Responses = this.reviewer2Responses.filter((res:any) => {
        return res?.userResponses?.candidateName?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        res?.userResponses?.jobId.toString().includes(this.searchQuery);
      });
    }
  }


  Download() {
    const link = document.createElement('a');
    link.href = this.baseUrl+'/downloadxlsheet';
    link.download = 'responses.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  
}
  
  

