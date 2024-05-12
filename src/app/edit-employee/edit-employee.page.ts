import { Component, OnInit } from '@angular/core';
import { Employee } from '../models/employee';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.page.html',
  styleUrls: ['./edit-employee.page.scss'],
})
export class EditEmployeePage implements OnInit {
  employe = {} as Employee;
  id : any;

  constructor(
    private actRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {
    this.id = this.actRoute.snapshot.paramMap.get("id");
   }

  ngOnInit() {
    this.getEmployeById(this.id);
  }

  async getEmployeById(id: string) {
    let loader = await this.loadingCtrl.create({
      message: "Please wait..."
    });
    await loader.present();
  
    try {
      this.firestore.doc("employees/" + id)
        .valueChanges()
        .subscribe((data: any) => { 
          if (data) {
            this.employe.nameEmp = data["nameEmp"];
            this.employe.details = data["details"];
            loader.dismiss();
          }
        });
    } catch (error) {
      console.error("Error fetching employee data:", error);
      loader.dismiss();
    }
  }

  async updateEmploye(){
    if (this.formValidation()) {
      
      let loader = await this.loadingCtrl.create({
        message: "Please wait..."
      });
      loader.present();

      try {
        await this.firestore.doc("posts/" + this.id).update(this.employe);
      } catch (error) {
        console.error('Error signing in:', error);
      }

      // dismiss loader
      await loader.dismiss();

      // redirect to home page
      this.navCtrl.navigateRoot("home");
    }

  }

  formValidation(){
    if(!this.employe.nameEmp){
      this.showToast("Enter Name");
      return false;
    }

    if(!this.employe.details){
      this.showToast("Entrer description");
      return false;
    }
    return true;

  }

  showToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    })
    .then(toastData => toastData.present());
  }
  

}
