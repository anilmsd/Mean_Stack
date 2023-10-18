import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-review2',
  templateUrl: './review2.component.html',
  styleUrls: ['./review2.component.css']
})
export class Review2Component {

  baseUrl:any;

  formData: any;
  userResponseId:any;
  userResponse:any;
  reviewer1ResponseId:any;
  getreviewerDetails: any;
  reviewerDetails: any;
  reviewerId: any;
  reviewerQuestion:any;
  selectedOptions: { [key: string]: any } = {};
  selectedResponses: { [key: string]: { questionId: string, optionId?: string, answer?: string } } = {};
  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.baseUrl= environment.apiUrl;

    this.getreviewerDetails = localStorage.getItem('userDetails');
    this.reviewerDetails = JSON.parse(this.getreviewerDetails);
    console.log(this.reviewerDetails);
    this.reviewerId=this.reviewerDetails.user._id;
    const requestBody = { reviewerId: this.reviewerId };
    console.log(this.reviewerId);
    this.httpClient.post(this.baseUrl+'/getR2LatestResponse',requestBody).subscribe(
      (response:any) => {
        console.log(response);
        this.formData = response.latestR1Response;
        this.userResponse = response.userResponse;
        this.reviewer1ResponseId=response.reviewer1ResponseId;
        // this.userResponseId=response.userResponseId;
        if(response.message){
          alert("No Reviews Found")
        }
      },
      error => {
        alert(error.error.errorMessage);
      }
    );

    this.httpClient.get<any>(this.baseUrl+'/getR2Questions').subscribe(
      (response:any) => {
        console.log(response);
        this.reviewerQuestion = response.Reviewer2Questions;
      },
      error => {
        alert(error.error.errorMessage);
      }
    );

  }


  onOptionSelected(optionText: any, question: any, indexValue: number) {
    console.log("question",question);
    
    const response = { questionId: question.id } as { questionId: string, optionId?: string, answer?: string };

    if (question.questionType === 'DropDown') {
      response.optionId = question.options.find((option:any) => option.optionText === optionText)?.id;
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


  submitForm() {
    
    const reviewer1ResponseId = this.reviewer1ResponseId;
    const responses = [];
  
    for (const questionId in this.selectedResponses) {
      if (this.selectedResponses.hasOwnProperty(questionId)) {
        const response = this.selectedResponses[questionId];
        responses.push(response);
      }
    }
    
    const submitData = {
      reviewer1ResponseId,
      responses
    };
  
    console.log(submitData);
    this.httpClient.post<any>(this.baseUrl+'/submitR2Response', submitData).subscribe(
      response => {
        console.log('Response submitted successfully:', response);
        alert('Response submitted successfully');
        window.location.reload();

      },
      error => {
        console.error('Error submitting response:', error);
      }
    );
  }


}
