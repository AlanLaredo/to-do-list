import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class TasksService {

    constructor(private http : HttpClient) {}

    get(): Promise<any> {
        return new Promise((resolve, reject) => {
            let url = environment.apiUrl + '/tasks'
            let data = {}
            this
                .http
                .get<any>(url, {params: data})
                .subscribe((cb) => {
                    resolve(cb)
                }, (err) => reject(err))
        })
    }

    getPending(): Promise<any> {
        return new Promise((resolve, reject) => {
            let url = environment.apiUrl + '/tasks/pending'
            let data = {}
            this
                .http
                .get<any>(url, {params: data})
                .subscribe((cb) => {
                    resolve(cb)
                }, (err) => reject(err))
        })
    }

    getCompleted(): Promise<any> {
        return new Promise((resolve, reject) => {
            let data = {}
            let url = environment.apiUrl + '/tasks/completed'

            this
                .http
                .get<any>(url, {params: data})
                .subscribe((cb) => {
                    if (cb.success) {
                        resolve(cb)
                    }
                }, (err) => reject(err))
        })
    }

    complete(taskId): Promise<any> {
        return new Promise((resolve, reject) => {
            let options = {}
            let data = {
                taskId
            }
            let url = environment.apiUrl + '/tasks/complete'

            this
                .http
                .post<any>(url, data, options)
                .subscribe((cb) => {
                    resolve(cb)
                }, (err) => reject(err))
        })
    }

    remove(taskId): Promise<any> {
        return new Promise((resolve, reject) => {
         
            let url = environment.apiUrl + '/tasks/'+taskId

            this
                .http
                .delete<any>(url)
                .subscribe((cb) => {
                    resolve(cb)
                }, (err) => reject(err))
        })
    }

    create(name : String, order : Number = 0): Promise<any> {
        return new Promise((resolve, reject) => {
            let options = {}
            let data = {
                name,
                order
            }
            let url = environment.apiUrl + '/tasks'

            this
                .http
                .put<any>(url, data, options)
                .subscribe((cb) => {
                    resolve(cb)
                }, (err) => reject(err))
        })
    }

    update(task): Promise<any> {
        return new Promise((resolve, reject) => {
            let options = {}
            let data = {
                task
            }
            let url = environment.apiUrl + '/tasks/edit'

            this
                .http
                .post<any>(url, data, options)
                .subscribe((cb) => {
                    resolve(cb)
                }, (err) => reject(err))
        })
    }

    updateName(taskId: string, name: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let options = {}
            let data = {
                name
            }
            let url = environment.apiUrl + '/tasks/name/'+taskId

            this
                .http
                .post<any>(url, data, options)
                .subscribe((cb) => {
                    resolve(cb)
                }, (err) => reject(err))
        })
    }
    

    updateOrder(tasks): Promise<any> {
        return new Promise((resolve, reject) => {
            let options = {}
            let data = {
                tasks
            }
            let url = environment.apiUrl + '/tasks/order'

            this
                .http
                .post<any>(url, data, options)
                .subscribe((cb) => {
                    resolve(cb)
                }, (err) => reject(err))
        })
    }

}
