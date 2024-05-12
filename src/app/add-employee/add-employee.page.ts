import { Component, OnInit } from '@angular/core';
import { Employee } from '../models/employee';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.page.html',
  styleUrls: ['./add-employee.page.scss'],
})
export class AddEmployeePage implements OnInit {

  employee = {} as Employee;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  async createEmployee (employee: Employee) {
    console.log("Creating employee:", employee)
    if (this.formValidation()) {

      let loader = await this.loadingCtrl.create({
        message: "Please wait..."
      });
      console.log("Showing loader...");
      loader.present();

      try {
        await this.firestore.collection("employees").add(employee);
        console.log("Employee added successfully.");
      } catch (error) {
        console.error("Error adding employee:", error);
        if (typeof error === 'string') {
          this.showToast(error);
        }
      }
      loader.dismiss();
      console.log("Loader dismissed.");

      this.navCtrl.navigateRoot("home");
    }

  }

  formValidation() {
    if (!this.employee.nameEmp) {
      this.showToast("Ecrire votre nom");
      return false;
    }

    if (!this.employee.details) {
      this.showToast("Décrire votre métier");
      return false;
    }
    return true;
  }

  showToast(message: string) {
    this.toastCtrl
      .create({
        message: message,
        duration: 3000
      })
      .then(toastData => toastData.present());
  }

}
