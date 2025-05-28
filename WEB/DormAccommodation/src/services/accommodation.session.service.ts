import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Consts} from '../app/utils/Consts';
import {AccommodationSessionDto} from '../app/models/accommodation.session.dto';

@Injectable({
  providedIn: 'root'
})
export class AccommodationSessionService {

  constructor(private http: HttpClient) {}

  getCurrent(): Observable<AccommodationSessionDto> {
    return this.http.get<AccommodationSessionDto>(Consts.ACCOMMODATION_SESSIONS_GET_CURRENT);
  }

  update(accommodationSessionDto: AccommodationSessionDto): Observable<any> {
    return this.http.put(`${Consts.ACCOMMODATION_SESSIONS_UPDATE}/${accommodationSessionDto.id}`, accommodationSessionDto);
  }

  create(accommodationSessionDto: AccommodationSessionDto): Observable<any> {
    return this.http.post(Consts.ACCOMMODATION_SESSIONS_CREATE,accommodationSessionDto);
  }

}
