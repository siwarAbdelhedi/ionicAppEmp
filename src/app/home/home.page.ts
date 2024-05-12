import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { Employee } from '../models/employee';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  employees: any;
  subscription: any;

  constructor(
    private toastCtrl: ToastController,
    private firestore: AngularFirestore,
    private loadingCtrl: LoadingController,
    private platform: Platform
  ) {}

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      if ('app' in navigator) {
        (navigator as any)["app"].exitApp();
      } 
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }
  
  async getEmployee(){

    let loader = await this.loadingCtrl.create({
      message: "Please wait..."
    });
    loader.present();

    try {
      this.firestore
        .collection("employees")
        .snapshotChanges()
        .subscribe(data => {
          this.employees = data.map(e => {
            const employeeData = e.payload.doc.data() as Employee;
            return {
              id: e.payload.doc.id,
              nameEmp: employeeData.nameEmp,
              details: employeeData.details
            };
          });

          loader.dismiss();
        });
    } catch (error) {
      console.error("Error fetching employee data:", error);
      loader.dismiss();
    }
  }

  async deleteEmployee(id: string){
    let loader = await this.loadingCtrl.create({
      message: "Please wait..."
    });
    loader.present();

    await this.firestore.doc("posts/" + id).delete();

    // dismiss loader
    loader.dismiss();
  }

  ionViewWillEnter() {
    this.getEmployee();

  }

  showToast(message: string) {
    this.toastCtrl.create({
        message: message,
        duration: 3000
      })
      .then(toastData => toastData.present());
  }

}
