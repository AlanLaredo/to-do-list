import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenStorageService } from 'src/app/services/auth/token-storage.service';
import { TasksService } from 'src/app/services/tasks/tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit {

    pendingTasks = []
    completedTasks = []
    segment: String = 'pendings'
    loadingPendingBar: boolean = false
    loadingCompletedBar: boolean = false

    constructor(private router: Router,         
        private tasksService: TasksService,
        public alertController: AlertController,
        public toastController: ToastController,
        private tokenStorageService: TokenStorageService,
        private loadingController: LoadingController,
        private authService: AuthService) { }

    ngOnInit() {
        this.loadPendingTasks()
        this.loadCompletedTasks()
    }

    goToCompleted() {
        this.router.navigate(['/completed-tasks']);
    }

    loadPendingTasks(recalculateOrder: boolean = false) {
        this.loadingPendingBar = true
        this.tasksService.getPending()
        .then((cb)=>{
            if(cb.success) {
                this.pendingTasks = cb.tasks
                this.pendingTasks.sort(function(a, b) {
                    return a.order - b.order;
                });
                if(recalculateOrder) {
                    this.recalculateOrder()
                    this.saveNewOrder()
                }
            }
        }).catch(async (cb)=> {
            const alert = await this.alertController.create({
                header: "To do list",
                subHeader: 'Carga de tareas pendientes',
                message: cb.error.err.message,
                buttons: ['OK']
              });
              alert.present()
        }).finally(()=> {
            this.loadingPendingBar = false
        })
    }

    loadCompletedTasks() {
        this.loadingCompletedBar = true
        this.tasksService.getCompleted()
        .then((cb)=>{
            if(cb.success) {
                let tasks = cb.tasks
                this.completedTasks = tasks.reverse()
            }
        }).catch(async (cb)=> {
            const alert = await this.alertController.create({
                header: "To do list",
                subHeader: 'Carga de tareas completadas',
                message: cb.error.err.message,
                buttons: ['OK']
              });
              alert.present()
        }).finally(()=> {
            this.loadingCompletedBar = false
        })
    }

    async saveNewTask() {
        const alert = await this.alertController.create({
            header: 'Añadir tarea',
            inputs: [{
                    name: 'Nombre',
                    type: 'text',
                    placeholder: 'Nueva tarea',
            },],
            buttons: [{
                text: 'Cancelar',
                role: 'cancelar',
                cssClass: 'secondary',
                handler: () => { }
            }, {
                text: 'Ok',
                handler: (rs) => {
                    if(rs.Nombre && rs.Nombre.trim()!="") {
                        let existsTaks = this.pendingTasks.find(pendingTask => pendingTask.name == rs.Nombre)
                        if(existsTaks) {
                            this.confirm("Ya hay una tarea con ese nombre", "Crear")
                            .then((rsConfirm)=> {
                                if(rsConfirm) this.create(rs.Nombre)
                            })
                        } else 
                            this.create(rs.Nombre)
                    } else {
                        this.toast('Introduzca un nombre.')
                        return false
                    }                  
                }
            }]
        });
        await alert.present();
    }

    async create(name: String) {
        const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Creando nueva tarea...'
        });
        await loading.present();
        let order = (this.pendingTasks.length + 1)
        this.tasksService.create(name, order)
        .then((cb)=>{
            if(cb.success) {
                this.toast("Se ha creado una nueva tarea")
                this.pendingTasks.push(cb.task)
            }
        }).catch(async (cb)=> {
            const alert = await this.alertController.create({
                header: "To do list",
                subHeader: 'Ha ocurrido un error al intentar crear la tarea',
                message: cb.error.err.message,
                buttons: ['OK']
            });
            alert.present()
        }).finally(()=> {
            loading.dismiss()
        })
    }

    reorderItems(ev:any) {
        const itemMove = this.pendingTasks.splice(ev.detail.from, 1)[0];
        this.pendingTasks.splice(ev.detail.to, 0, itemMove)
        ev.detail.complete()
        this.recalculateOrder()
        this.saveNewOrder()
    }

    recalculateOrder() {
        this.pendingTasks.map((task, index)=> {
            return task.order = index + 1
        })
    }

    saveNewOrder() {
        this.tasksService.updateOrder(this.pendingTasks)
        .then((cb)=>{
            this.toast('Lista actualizada', 1)
        }).catch(async (cb)=> {
            const alert = await this.alertController.create({
                header: "To do list",
                subHeader: 'Error al actualizar el orden',
                message: cb.error.err.message,
                buttons: ['OK']
              });
              alert.present()
        })
    }
    
    async completeTask(task) {
        const alert = await this.alertController.create({
            header: "To do list",
            subHeader: 'Completar tarea',
            message: "¿Está seguro de completar esta tarea?",
            buttons: ['Cancelar', {
                        text: 'Completar',
                        role: 'completar',
                        handler: () => {
                            this.complete(task)    
                        }
                    }]
          });
          alert.present()
    }

    async complete(task: any) {
        const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Completado tarea...',
        });
        await loading.present();
        this.tasksService.complete(task._id)
        .then((cb)=>{
            this.toast('Se ha completado una tarea', 2)
            this.loadPendingTasks(true)
            this.loadCompletedTasks()
        }).catch(async (cb)=> {
            const alert = await this.alertController.create({
                header: "To do list",
                subHeader: 'Error al completar la tarea',
                message: cb.error.err.message,
                buttons: ['OK']
             });
            alert.present()
        }).finally(()=>{
            loading.dismiss()
        })
    }
    
    async removeTask(task: any) {
        const alert = await this.alertController.create({
            header: "To do list",
            subHeader: 'Eliminar tarea',
            message: "¿Está seguro de eliminar esta tarea?",
            buttons: ['Cancelar', {
                        text: 'Eliminar',
                        role: 'eliminar',
                        handler: () => { 
                            this.remove(task)
                        }
                    }]
        });
        alert.present()       
    }

    async remove(task: any) {
        const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Eliminando...',
        });
        await loading.present();
        this.tasksService.remove(task._id)  
        .then((cb)=>{
            this.toast('Se ha eliminado una tarea', 1)
            this.loadPendingTasks(true)
            this.loadCompletedTasks()
        }).catch(async (cb)=> {
            const alert = await this.alertController.create({
                header: "To do list",
                subHeader: 'Error al eliminar la tarea',
                message: cb.error.err.message,
                buttons: ['OK']
            });
            alert.present()
        }).finally(()=> {
            loading.dismiss()
        })
    }

    async editTask(task: any) {
        const alert = await this.alertController.create({
            header: 'Editar Tarea',
            inputs: [{
                    name: 'Nombre',
                    type: 'text',
                    value: task.name,
                    placeholder: 'Nueva tarea',
                },
            ], buttons: [{
                text: 'Cancelar',
                role: 'cancelar',
                cssClass: 'secondary',
                handler: () => { }
            }, {
                text: 'Editar',
                handler: (rs) => {
                    if(rs.Nombre && rs.Nombre.trim()!="") {
                        let existsTaks = this.pendingTasks.find(pendingTask => pendingTask.name == rs.Nombre)
                        if(existsTaks) {
                            this.confirm("Ya hay una tarea con ese nombre", "Editar")
                            .then((rsConfirm)=> {
                                if(rsConfirm) this.updateNameTask(task._id,rs.Nombre)
                            })
                        } else 
                            this.updateNameTask(task._id,rs.Nombre)
                    } else {
                        this.toast('Introduzca un nombre.')
                        return false
                    }                  
                }
            }]
        });
        await alert.present();
    }

    async updateNameTask(taskId: string, name: string) {
        const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Guardando cambios...',
        });
        await loading.present();
        this.tasksService.updateName(taskId, name)
        .then((cb)=>{
            this.toast('Lista actualizada', 1)
            this.loadPendingTasks(true)
            this.loadCompletedTasks()
        }).catch(async (cb)=> {
            const alert = await this.alertController.create({
                header: "To do list",
                subHeader: 'Error al actualizar el nombre',
                message: cb.error.err.message,
                buttons: ['OK']
              });
              alert.present()
        }).finally(() => {
            loading.dismiss()
        })
    }

    async logOut() {
        const alert = await this.alertController.create({
            header: "To do list",
            subHeader: 'Cerrar sesión',
            message: "¿Está seguro de cerrar sesión?",
            buttons: ['Cancelar', {
                        text: 'Cerrar',
                        role: 'cerrar',
                        handler: () => {
                            this.authService.logOut()
                            .then()
                            .finally(()=> {
                                this.router.navigate(['/login'])
                                this.tokenStorageService.signOut()
                            })
                        }
                    }]
          });
          alert.present()
    }
    
    segmentChanged(ev: any) {
        // console.log('Segment changed', ev.target.value);
    }

    async toast(title: string, seconds: number = 3) {
        const toast = await this.toastController.create({
            message: title,
            duration: seconds * 1000
        });
        await toast.present() 
    }

    async confirm(text: string, successBtnText): Promise<Boolean> {
        return new Promise(async (resolve, reject) => {
            const alert = await this.alertController.create({
                header: text,
                buttons: [{
                    text: 'Cancelar',
                    role: 'cancelar',
                    cssClass: 'secondary',
                    handler: () => { 
                        resolve(false)
                    }
                }, {
                    text: successBtnText,
                    handler: (rs) => {
                        resolve(true)            
                    }
                }]
            });
            await alert.present();
        })
    }
}
