import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-edit-review',
  templateUrl: './edit-review.component.html',
  styleUrls: ['./edit-review.component.css']
})
export class EditReviewComponent {


  baseUrl:any;


  userResponseId: any;
  reviewer1ResponseId: any;
  reviewer2ResponseId: any;
  indexValue:any;

  reviewer1Response: any;
  reviewer2Response: any;
  userResponse: any;


  recruiterQuestions: any;
  reviewer1Questions: any;
  reviewer2Questions: any;


  candidate_Name:any;
  candidate_Email:any;
  Arya_JobID:any;
  Partner_Client:any;
  End_Client:any;


  selectedResponses: { [key: string]: { questionId: string, adminOptionId?: string, adminAnswer?: string } } = {};


  constructor(private httpClient: HttpClient, private route: ActivatedRoute, private router: Router) {

    this.route.queryParams.subscribe((params: Params) => {
      console.log(params);
      this.userResponseId = atob(params['userResponseId']);
      this.reviewer1ResponseId = atob(params['reviewer1ResponseId']);
      this.reviewer2ResponseId = atob(params['reviewer2ResponseId']);
      this.indexValue=atob(params['indexValue']);

    });
  }

  ngOnInit() {

    this.baseUrl= environment.apiUrl;


    console.log(this.userResponseId, this.reviewer1ResponseId, this.reviewer2ResponseId);


    this.httpClient.get(this.baseUrl+`/viewReview?uid=${this.userResponseId}&r1id=${this.reviewer1ResponseId}&r2id=${this.reviewer2ResponseId}`).subscribe(
      (response: any) => {
        console.log(response);
        // this.data = response.formattedResponses;
        this.reviewer1Response = response.reviewer1Responses;
        this.reviewer2Response = response.reviewer2Responses;
        this.userResponse = response.userResponses;
        ;
      },
      error => {
        alert(error.error.errorMessage);
      }
    );

    this.httpClient.get<any>(this.baseUrl+'/getForm/6513effb670f5328b6dd023d').subscribe(
      response => {
        // console.log(response);
        this.recruiterQuestions = response.form;
      },
      error => {
        alert(error.error.errorMessage);
      }
    );


    //r1 questions

    this.httpClient.get<any>(this.baseUrl+'/getR1Questions').subscribe(
      (response: any) => {
        console.log("r1 questions", response);
        this.reviewer1Questions = response.Reviewer1Questions;
      },
      error => {
        alert(error.error.errorMessage);
      }
    );

    this.httpClient.get<any>(this.baseUrl+'/getR2Questions').subscribe(
      (response: any) => {
        console.log("r2 questions ", response);
        this.reviewer2Questions = response.Reviewer2Questions;
      },
      error => {
        alert(error.error.errorMessage);
      }
    );

  }

  back() {
    this.router.navigate(['/admin'],);
  }


  onOptionSelected(optionText: any, question: any) {
    console.log("qustion", question);

    if(question.id =='6513f0a64926a9ef6ab216c0'){
      this.Partner_Client=optionText;
    } else if(question.id =='6513f57e7f921260167c5e75'){
      this.End_Client=optionText;
    }


    const response = { questionId: question.id } as { questionId: string, adminOptionId?: string, adminAnswer?: string };

    if (question.questionType === 'DropDown') {
      response.adminOptionId = question.options.find((option: any) => option.optionText === optionText)?.id;
    } else if (question.questionType === 'Text') {
      response.adminAnswer = optionText;
    }

    this.selectedResponses[question.id] = response;
  }

  onTextInput(questionId: string, adminAnswer: string) {
    const response = {
      questionId,
      adminAnswer
    };

    if(questionId =='6513f70b7f921260167c5e8c'){
      this.candidate_Name=adminAnswer;
    }else if(questionId =='6513f5eb7f921260167c5e82'){
      this.Arya_JobID=adminAnswer;
    }
   else if(questionId =='6513f72d7f921260167c5e8e'){
      this.candidate_Email=adminAnswer;
    }

    console.log(response);
    this.selectedResponses[questionId] = response;
    console.log(this.selectedResponses);
  }

  updateRecruiterForm() {
    // this.getreviewerDetails = localStorage.getItem('userDetails');
    // this.reviewerDetails = JSON.parse(this.getreviewerDetails);
    // const userId = this.reviewerDetails.user._id;
    const jobId = this.Arya_JobID;
    const candidateName = this.candidate_Name;
    const candidateEmail = this.candidate_Email;
    const partnerClient = this.Partner_Client;
    const endClient = this.End_Client;
    const indexValue=this.indexValue;
    // console.log(candidateName);
    // const formId = this.formData._id;
    const responses = [];

    for (const questionId in this.selectedResponses) {
      if (this.selectedResponses.hasOwnProperty(questionId)) {
        const response = this.selectedResponses[questionId];
        responses.push(response);
      }
    }

    const userRId = this.userResponseId;

    const submitData = {
      jobId,
      candidateName,
      candidateEmail,
      partnerClient,
      endClient,
      userRId,
      indexValue,
      responses
    };

    console.log(submitData);
    this.httpClient.post<any>(this.baseUrl+'/updateResponseByAdmin', submitData).subscribe(
      response => {
        console.log('Response updated successfully:', response);
        window.location.reload();

      },
      error => {
        console.error('Error submitting response:', error);
      }
    );

  }

  updateReviewer1Form() {
    
    const responses = [];

    for (const questionId in this.selectedResponses) {
      if (this.selectedResponses.hasOwnProperty(questionId)) {
        const response = this.selectedResponses[questionId];
        responses.push(response);
      }
    }

    const Reviewer1Id = this.reviewer1ResponseId;
    const indexValue=this.indexValue;

    const submitData = {
      Reviewer1Id,
      indexValue,
      responses
    };

    console.log(submitData);
    this.httpClient.post<any>(this.baseUrl+'/updateR1ResponseByAdmin', submitData).subscribe(
      response => {
        console.log('Response updated successfully:', response);
        window.location.reload();

      },
      error => {
        console.error('Error submitting response:', error);
      }
    );

  }

  updateReviewer2Form() {
    
    const responses = [];

    for (const questionId in this.selectedResponses) {
      if (this.selectedResponses.hasOwnProperty(questionId)) {
        const response = this.selectedResponses[questionId];
        responses.push(response);
      }
    }

    const Reviewer2Id = this.reviewer2ResponseId;
    const indexValue=this.indexValue;

    const submitData = {
      Reviewer2Id,
      indexValue,
      responses
    };

    console.log(submitData);
    this.httpClient.post<any>(this.baseUrl+'/updateR2ResponseByAdmin', submitData).subscribe(
      response => {
        console.log('Response updated successfully:', response);
        window.location.reload();

      },
      error => {
        console.error('Error submitting response:', error);
      }
    );

  }

}
