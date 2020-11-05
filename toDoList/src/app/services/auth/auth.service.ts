import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class AuthService {

    constructor(private http : HttpClient) {}

    login(username : String, password : String): Promise<any> {
        return new Promise((resolve, reject) => {
            let options = {}
            let data = {
                username,
                password
            }
            let url = environment.apiUrl + '/auth/login'

            this
                .http
                .post<any>(url, data, options)
                .subscribe((cb) => {
                    //desactivar loading
                    if (cb.success) {
                        // mensaje de bienvenida generación de sesión cb.token redirección a ventanada
                        // de tareas
                        resolve(cb)
                    }
                }, (err) => reject(err))
        })
    }
}
