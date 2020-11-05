import { Component, OnInit, ɵConsole } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenStorageService } from 'src/app/services/auth/token-storage.service';
import { TasksService } from 'src/app/services/tasks/tasks.service';
import { environment } from 'src/environments/environment';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    username: string = 'alan'
    password: string = 'laredo'
    constructor(private authService: AuthService, 
        private tokenStorageService: TokenStorageService,
        public alertController: AlertController,
        public toastController: ToastController,
        private router: Router) { }
    
    ngOnInit() {
    }
    
    login(): void {

        //activar loading
        let username = this.username
        let password = this.password
        let toggleOrder : boolean = false
        this.authService.login(username, password)
        .then((cb)=>{
            this.router.navigate(['/tasks']);
            this.tokenStorageService.saveToken(cb.token);
            this.tokenStorageService.saveUser(cb.user);            
        }).catch(async (cb)=> {
            const toast = await this.toastController.create({
                message: cb.error.err.message,
                duration: 1000
            });
            await toast.present() 
        })        
    }
}