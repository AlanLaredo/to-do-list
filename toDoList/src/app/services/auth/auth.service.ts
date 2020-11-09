import {Injectable} from '@angular/core';
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
                .subscribe(cb => {
                    if (cb.success) {
                        resolve(cb)
                    }
                }, err => reject(err))
        })
    }

    logOut(): Promise<any> {
        return new Promise((resolve, reject) => {
            let options = {}
            let data = {}
            let url = environment.apiUrl + '/auth/logout'

            this
                .http
                .post<any>(url, data, options)
                .subscribe(cb => {
                    resolve(cb)
                }, err => {
                    reject(err)
                })
        })
    }

    checkUsername(username : string) {
        return new Promise((resolve, reject) => {
            let url = environment.apiUrl + '/auth/checkusername/' + username
            this
                .http
                .get<any>(url)
                .subscribe((cb) => {
                    resolve(cb)
                }, (err) => reject(err))
        })
    }
}