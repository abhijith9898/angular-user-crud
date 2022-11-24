import { Component, OnInit } from '@angular/core';
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
  showForm:boolean = false;
  formHeader: string;
  constructor(private messageService: MessageService, private userServiceService:UserServiceService,private confirmationService:ConfirmationService) { }

  ngOnInit() {
    this.getUsersList();
  }

  openAddNew(){
    this.user = {};
    this.formHeader = "ADD USER";
    this.showForm = true;
  }

  save(){
    if(!this.user.id){
      console.log('payload',this.user);
      if (this.user.name == undefined || this.user.email == undefined || this.user.gender == undefined || this.user.status == undefined) {
        this.messageService.add({ severity: 'warn', detail: 'Enter all User details'});      }
      else {
        this.userServiceService.createUser(this.user).subscribe((result) => {
          console.log("user created", result);
          this.showForm = false;
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
          this.showForm = false;
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
    this.showForm = false;
  }

  getUsersList(){
    this.userServiceService.getUsers().subscribe((result) => {
      console.log("res",result);
      this.userData = result;
    },(error) => {
      console.log("error",error)
    })
  }

  onClickEdit(userId) {
    this.formHeader = "EDIT USER";
    this.userServiceService.getUserById(userId).subscribe((result) => {
      console.log("res user",result);
      this.user = result;
      this.showForm = true;
    },(error) => {
      console.log("error",error)
    })        
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
