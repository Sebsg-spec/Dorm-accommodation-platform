import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Consts} from '../app/utils/Consts';
import {UserApplicationDto} from '../app/models/user.application.dto';
import {Application} from '../app/models/application.model';
import { StatusUpdateDto } from '../app/models/status.update.dto';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private http: HttpClient) { }
  getUserApplications(): Observable<UserApplicationDto[]> {
    return this.http.get<UserApplicationDto[]>(`${Consts.APPLICATIONS_GET}`);
  }

  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${Consts.APPLICATIONS}`);
  }

  getApplicationById(id: number): Observable<Application> {
    return this.http.get<Application>(`${Consts.APPLICATIONS}/${id}`);
  }

  getApplicationDetails(id: number): Observable<UserApplicationDto> {
    return this.http.get<UserApplicationDto>(`${Consts.APPLICATION_DETAILS}/${id}`);
  }

  postApplication(app: FormData): Observable<Application> {
    return this.http.post<Application>(`${Consts.APPLICATIONS}`, app);
  }

  deleteApplication(id: number): Observable<void> {
    return this.http.delete<void>(`${Consts.APPLICATIONS}/${id}`);
  }

  updateApplicationStatus(id: number, statusUpdateDto: StatusUpdateDto): Observable<void> {
    return this.http.patch<void>(`${Consts.APPLICATIONS}/${id}`, statusUpdateDto);
  }

  getApplicationDocuments(applicationId: number): Observable<string[]> {
    return this.http.get<string[]>(`${Consts.APPLICATION_DOCUMENTS}/${applicationId}`);
  }
  
  getDocumentFile(applicationId: number, fileName: string): Observable<Blob> {
    return this.http.get(`${Consts.APPLICATION_DOCUMENTS}/${applicationId}/${fileName}`, {
      responseType: 'blob'
    });
  }
}


