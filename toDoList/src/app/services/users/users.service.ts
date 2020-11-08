import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class UsersService {

    constructor(private http : HttpClient) {}

    create(username: string, password: string) {
        return new Promise((resolve, reject) => {
            let data = {username, password}
            let url = environment.apiUrl + '/users'
            this
                .http
                .put<any>(url, data)
                .subscribe((cb) => {
                    resolve(cb)
                }, (err) => reject(err))
        })
    }

    checkUsername(username: string) {
        return new Promise((resolve, reject) => {
            let url = environment.apiUrl + '/users/checkusername/' + username
            this
                .http
                .get<any>(url)
                .subscribe((cb) => {
                    resolve(cb)
                }, (err) => reject(err))
        })
    }
}