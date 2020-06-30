import { Component } from '@angular/core';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tasks: any[] = [];

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
    ) {
      const tasksJson = localStorage.getItem('tasksDB');
      if (tasksJson != null) {
        this.tasks = JSON.parse(tasksJson);
      }
    }

  async openActions(task: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'O QUE DESEJA FAZER?',
      buttons: [{
        text: task.done ? 'Desmarcar' : 'Marcar',
        icon: task.done ? 'radio-button-off' : 'checkmark-circle',
        handler: () => {
          task.done = !task.done;
          this.updateLocalStorage();
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async delete(task: any) {
    const alert = await this.alertCtrl.create({
      header: 'ALERTA!',
      message: '<br>Deseja realmente excluir a tarefa?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'alert-no',
          handler: (blah) => {
            console.log('Não Confirmado');
          }
        }, {
          text: 'Sim',
          handler: () => {
            console.log('Confirmado');
            this.tasks = this.tasks.filter(taskArray => task !== taskArray);
            this.updateLocalStorage();
          }
        }
      ]
    });
    await alert.present();
  }

  async showAdd() {
    const alert = await this.alertCtrl.create({
      header: 'O QUE DESEJA FAZER?',
      inputs: [
        {
          name: 'taskToDo',
          type: 'text',
          placeholder: 'Informe a tarefa'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-no',
          handler: () => {
            console.log('Cancelar Clicado');
          }
        },
        {
          text: 'Adicionar',
          cssClass: 'alert-yes',
          handler: (form) => {
            this.add(form.taskToDo);
          }
        }
      ]
    });
    await alert.present();
  }

  updateLocalStorage() {
    localStorage.setItem('tasksDB', JSON.stringify(this.tasks));
  }

  async add(taskToDo: string) {
    if (taskToDo.trim().length < 1) {
      const toast = await this.toastCtrl.create({
        message: 'INFORME O QUE DESEJA FAZER!',
        duration: 3000,
        position: 'bottom'
      });
      await toast.present();
      return;
    }
    const task = { name: taskToDo, done: false };
    this.tasks.push(task);
    this.updateLocalStorage();
  }

}
