import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})


export class ReviewComponent {
  baseUrl:any;

  formData: any;
  userResponseId:any;
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
    this.reviewerId=this.reviewerDetails.user._id;
    const requestBody = { reviewerId: this.reviewerId }
    console.log(this.reviewerId);
    this.httpClient.post(this.baseUrl+'/getLatestResponse', requestBody).subscribe(
      (response:any) => {
        console.log(response);
        this.formData = response.latestResponse;
        this.userResponseId=response.userResponseId;
        if(response.message){
          alert("No Reviews Found")
        }
      },
      error => {
        alert(error.error.errorMessage);
      }
    );

    this.httpClient.get<any>(this.baseUrl+'/getR1Questions').subscribe(
      (response:any) => {
        console.log(response);
        this.reviewerQuestion = response.Reviewer1Questions;
      },
      error => {
        alert(error.error.errorMessage);
      }
    );

  }


  onOptionSelected(optionText: any, question: any, indexValue: number) {
    // this.indexValue = indexValue + 2;
    console.log("question",question);
    // const linkedBranchedQuestion = question.options.find(
    //   (option: any) => option.optionText === optionText
    // );

    // this.selectedOptions[question.id] = linkedBranchedQuestion;
    // this.linkedQuestion = linkedBranchedQuestion;
      // console.log("linked questions",this.linkedQuestion);
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
    
    const userResponseId = this.userResponseId;
    const responses = [];
  
    for (const questionId in this.selectedResponses) {
      if (this.selectedResponses.hasOwnProperty(questionId)) {
        const response = this.selectedResponses[questionId];
        responses.push(response);
      }
    }
    
    const submitData = {
      userResponseId,
      responses
    };
  
    console.log(submitData);
    this.httpClient.post<any>(this.baseUrl+'/submitR1Response', submitData).subscribe(
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
