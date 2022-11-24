import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { MessageService,ConfirmationService } from 'primeng/api';
import { User } from '../app/model';
import { UserServiceService } from '..//app/user-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class AppComponent implements OnInit {
  title = 'angular-user-crud';
  userData: User[];
  currentUserId: any;
  user: User = {};
  showAddForm:boolean = false;
  constructor(private primengConfig: PrimeNGConfig, private messageService: MessageService, private userServiceService:UserServiceService,private confirmationService:ConfirmationService) { }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.getUsersList();
  }

  openAddNew(){
    this.user = {};
    this.showAddForm = true;
  }

  save(){
    if(!this.user.id){
      console.log('payload',this.user);
      if (this.user.name == undefined || this.user.email == undefined || this.user.gender == undefined || this.user.status == undefined) {
        this.messageService.add({ severity: 'warn', detail: 'Enter all User details'});      }
      else {
        this.userServiceService.createUser(this.user).subscribe((result) => {
          console.log("user created", result);
          this.showAddForm = false;
          this.messageService.add({ severity: 'success', detail: 'User Added Successfully'});
          this.getUsersList();
        },
        (error) => {
          this.messageService.add({ severity: 'error', detail: error.message});
        });
      }
    } else{
      if (this.user.name == '' || this.user.email == '' || this.user.gender == '' || this.user.status == '') {
        this.messageService.add({ severity: 'warn', detail: 'Enter all User details'});      }
      else {
        this.userServiceService.updateUser(this.user).subscribe((result) => {
          console.log("user updated", result);
          this.showAddForm = false;
          this.messageService.add({ severity: 'success', detail: 'User Updated'});
          this.getUsersList();
        },
        (error) => {
          this.messageService.add({ severity: 'error', detail: error.message});
        });
      }      
    }

  }

  cancel(){
    this.showAddForm = false;
  }

  getUsersList(){
    this.userServiceService.getUsers().subscribe((result) => {
      console.log("res",result);
      this.userData = result;
    },(error) => {
      console.log("error",error)
    })
  }

  onClickEdit(user: User) {
    this.user = {...user};
    this.showAddForm = true;
  }

  onClickDelete(user: User) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete user ' + user.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userServiceService.deleteUser(user.id).subscribe((result) => {
          this.getUsersList();
          console.log("delete successfull", result);
          this.messageService.add({ severity: 'success', detail: 'User Deleted!'});
        },
        (error) => {
          console.log(error);
        });
      }
  });    
  }
}
