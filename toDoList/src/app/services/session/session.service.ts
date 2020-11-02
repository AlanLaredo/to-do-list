import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(/*private http: HttpClient*/) { }

  login(user: string, password: string) {

    alert(environment.apiUrl + user + password);

  }
}
