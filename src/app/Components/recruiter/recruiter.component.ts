import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recruiter',
  templateUrl: './recruiter.component.html',
  styleUrls: ['./recruiter.component.css']
})
export class RecruiterComponent {


  title = 'Aod-project';
  baseUrl:any;

  isListening: boolean = false;
  transcript: string = '';
  formData: any;
  selectedOptions: { [key: string]: any } = {};
  selectedResponses: { [key: string]: { questionId: string, optionId?: string, answer?: string } } = {};

  getreviewerDetails: any;
  reviewerDetails: any;
  reviewerId: any;

  recruiterForm: boolean = true;
  recruiterReviews: boolean = false;
  recruiterReviewsData: any
  oneUserResponseData:any;
  showFormButton:boolean=false;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {

    this.baseUrl= environment.apiUrl;

    this.getreviewerDetails = localStorage.getItem('userDetails');
    this.reviewerDetails = JSON.parse(this.getreviewerDetails);
    this.reviewerId = this.reviewerDetails.user._id;

    this.httpClient.get<any>(this.baseUrl+'/getForm/6513effb670f5328b6dd023d').subscribe(
      response => {
        console.log(response);
        this.formData = response.form;
      },
      error => {
        alert(error.error.errorMessage);
      }
    );
  }

  indexValue!: number;
  linkedQuestion!: any;
  candidate_Name: any;
  candidate_Email: any;
  Arya_JobID: any;
  Partner_Client: any;
  End_Client: any;

  trackByFn(index: number, item: any): number {
    return index; // or item.id if available
  }


  // onOptionSelected(optionText: any, question: any, indexValue: number) {
  //   this.indexValue = indexValue + 2;
  //   console.log("qustion",question);
  //   const linkedBranchedQuestion = question.options.find(
  //     (option: any) => option.optionText === optionText
  //   );

  //   this.selectedOptions[question.id] = linkedBranchedQuestion;
  //   this.linkedQuestion = linkedBranchedQuestion;
  //     console.log("linked questions",this.linkedQuestion);
  //     console.log("selected options",this.selectedOptions);
  //   const response = { questionId: question.id } as { questionId: string, optionId?: string, answer?: string };

  //   if (question.questionType === 'DropDown') {
  //     response.optionId = question.options.find((option:any) => option.optionText === optionText)?.id;
  //   } else if (question.questionType === 'Text') {
  //     response.answer = optionText;
  //   }

  //   this.selectedResponses[question.id] = response;
  // }


  onOptionSelected(optionText: any, question: any, indexValue: number) {
    this.indexValue = indexValue + 2;
    console.log("qustion", question);

    if (question.id == '6513f0a64926a9ef6ab216c0') {
      this.Partner_Client = optionText;
    } else if (question.id == '6513f57e7f921260167c5e75') {
      this.End_Client = optionText;
    }

    const linkedBranchedQuestion = question.options.find(
      (option: any) => option.optionText === optionText
    );

    this.selectedOptions[question.id] = linkedBranchedQuestion?.optionQuestion.length > 0 ? linkedBranchedQuestion : null;
    this.linkedQuestion = linkedBranchedQuestion?.optionQuestion.length > 0 ? linkedBranchedQuestion : null;
    console.log("linked questions", this.linkedQuestion);
    console.log("selected options", this.selectedOptions);
    const response = { questionId: question.id } as { questionId: string, optionId?: string, answer?: string };

    if (question.questionType === 'DropDown') {
      response.optionId = question.options.find((option: any) => option.optionText === optionText)?.id;
    } else if (question.questionType === 'Text') {
      response.answer = optionText;
    }

    this.selectedResponses[question.id] = response;
  }


  onTextInput(questionId: string, answer: string) {
    const response = {
      questionId,
      answer
    };

    if (questionId == '6513f70b7f921260167c5e8c') {
      this.candidate_Name = answer;
    } else if (questionId == '6513f5eb7f921260167c5e82') {
      this.Arya_JobID = answer;
    }
    else if (questionId == '6513f72d7f921260167c5e8e') {
      this.candidate_Email = answer;
    }
    console.log(response);
    this.selectedResponses[questionId] = response;
    console.log(this.selectedResponses);
  }


  onDateInput(questionId: string, dateValue: string) {
    const response = {
      questionId,
      answer: dateValue
    };
    this.selectedResponses[questionId] = response;
  }



  showrecruiterForm(){
    this.showFormButton=false;
    this.recruiterForm=true;
    this.recruiterReviews=false;
    this.oneUserResponseData=false;
  }



  submitForm() {
    this.getreviewerDetails = localStorage.getItem('userDetails');
    this.reviewerDetails = JSON.parse(this.getreviewerDetails);
    const userId = this.reviewerDetails.user._id;
    const jobId = this.Arya_JobID;
    const candidateName = this.candidate_Name;
    const candidateEmail = this.candidate_Email;
    const partnerClient = this.Partner_Client;
    const endClient = this.End_Client;

    console.log(candidateName);
    const formId = this.formData._id;
    const responses = [];

    for (const questionId in this.selectedResponses) {
      if (this.selectedResponses.hasOwnProperty(questionId)) {
        const response = this.selectedResponses[questionId];
        responses.push(response);
      }
    }

    const submitData = {
      formId,
      userId,
      jobId,
      candidateName,
      candidateEmail,
      partnerClient,
      endClient,
      responses
    };

    console.log(submitData);
    this.httpClient.post<any>(this.baseUrl+'/submitResponse', submitData).subscribe(
      response => {
        console.log('Response submitted successfully:', response);

        // Assuming response contains userResponseId
        const userResponseId = response.userResponse._id;

        // Now call the updateSubmitResponse endpoint
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput.files && fileInput.files.length > 0) {
          this.onFileSelected({ target: { files: [fileInput.files[0]] } }, userResponseId);
        }
        else {
          console.error('No file selected.');
        }
      },
      error => {
        console.error('Error submitting response:', error);
      }
    );

  }

  sendQuestionId: any;
  getQuestion(questionId: any) {
    return this.sendQuestionId = questionId;
  }
  getQuestionIdSomehow() {
    return this.sendQuestionId;
  }

  onFileSelected(event: any, userResponseId: string) {
    const questionId = this.getQuestionIdSomehow(); // You'll need to get the questionId here
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('questionId', questionId);
    this.httpClient.post<any>(this.baseUrl+`/updateSubmitResponse/${userResponseId}`, formData).subscribe(
      response => {
        console.log('File uploaded successfully:', response);
        window.location.reload();
      },
      error => {
        console.error('Error uploading file:', error);
      }
    );
  }



  getYourReviews() {

    this.recruiterForm = false;
    this.showFormButton=true;
    this.oneUserResponseData=false;

    this.recruiterReviews = true;

    const modelData = {
      model: 'userResponse',
      userId: this.reviewerId,
    }

    this.httpClient.post<any>(this.baseUrl+'/getAllReviews', modelData).subscribe(
      response => {
        console.log(response);
        this.recruiterReviewsData=response.response;
      },
      error => {
        console.error(error);
      }
    );
  }

  getReview(userResponseId:any){
    this.httpClient.get<any>(this.baseUrl+`/getOneUserResponse/${userResponseId}` ).subscribe(
      response => {
        console.log(response);
        this.oneUserResponseData=response.response;
        this.recruiterReviews=false;
      },
      error => {
        console.error(error);
      }
    );
  }

}
