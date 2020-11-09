import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-registry',
  templateUrl: './registry.page.html',
  styleUrls: ['./registry.page.scss'],
})
export class RegistryPage implements OnInit {

    securityEvaluation: number = 0
    username: string
    password: string = ''
    passwordConfirmation: string
    availableUsername: boolean = true
    checked: boolean = false

    constructor(
        public toastController: ToastController,
        public usersService: UsersService,
        public router: Router,
        public alertController: AlertController
    ) { }

    ngOnInit() { }

    guardar() {
        if(!this.registryIsValid()) return
        this.usersService.create(this.username, this.password)
        .then((cb:any) => {
            if(cb.success) {
                this.toast("Se ha creado tu usuario") 
                this.router.navigate(['/login']);
                this.cleanForm()
            }
        }).catch(async (cb)=> {
            const alert = await this.alertController.create({
                header: "To do list",
                subHeader: 'Error al intetar registrar',
                message: cb.error.message,
                buttons: ['OK']
            });
            alert.present()
        })
    }

    clearSpaces() {
        this.username = this.username.replace(/\s/g, "");
    }

    registryIsValid() {
        if(!this.availableUsername || !this.username) {
            this.toast('El nombre de usuario no es valido')
            return false
        }
        if(this.passwordConfirmation != this.passwordConfirmation) {
            this.toast('Las contraseñas no coinciden')
            return false
        }
        if(!this.password) {
            this.toast('La contraseña no es válida')
            return false
        }
        return true
    }
    
    existsUser() {
        this.checked = false
        if(this.username) 
            this.usersService.checkUsername(this.username)
            .then((cb: any)=> {
                this.availableUsername = !cb.exists
                this.checked = true
            }).catch(async (cb)=> {
                const alert = await this.alertController.create({
                    header: "To do list",
                    subHeader: 'Error al intetar revisar el nombre',
                    message: cb.error.message,
                    buttons: ['OK']
                });
                alert.present()
            })
    }
    
    passwordEvaluation() {
        let puntuation = 0
        this.securityEvaluation = 0
        if(this.hasNumbers()) puntuation++
        if(this.hasLetters()) puntuation++
        if(this.hasMoreThanEitght()) puntuation++
        if(this.hasSymbols()) puntuation++
        this.securityEvaluation = puntuation *.25
    }

    getEvaluationColor() {
        let rsColor = "medium"
        let securityEvaluation = this.securityEvaluation
        if(securityEvaluation == .25) rsColor = 'danger'
        if(securityEvaluation == .50) rsColor = 'danger'
        if(securityEvaluation == .75) rsColor = 'warning'
        if(securityEvaluation == 1) rsColor = 'success'
        return rsColor
    }

    hasNumbers() {
        let rs = false
        let regExnumbers =  /\d/
        if(this.password.match(regExnumbers)) rs = true
        return rs
    }

    hasLetters() {
        let rs = false
        let regExletters = /[a-zA-Z]/g
        if(this.password.match(regExletters)) rs = true
        return rs
    }

    hasMoreThanEitght() {
        let rs = false
        if(this.password.length >= 8) rs = true
        return rs
    }

    hasSymbols() {
        let rs = false
        let regExSymbols =  /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
        if(this.password.match(regExSymbols)) rs = true
        return rs
    }

    cleanForm() {
        this.username =''
        this.password = ''
        this.passwordConfirmation = ''
    }

    async toast(title: string, seconds: number = 1) {
        const toast = await this.toastController.create({
            message: title,
            duration: seconds * 1000
        });
        await toast.present() 
    }
}
