import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/services/session/session.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    user: string = '';  
    password: string = '';  
    constructor(private sessionService: SessionService) { }

    ngOnInit() {
    }

    login(): void {
        this.sessionService.login(this.user, this.password)
    }

}
