import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../app/model';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  user: User
  API = "https://gorest.co.in";
  access_Token = 'e2c4b24a7f813a70903bbdef88187c0ccc861372cba013f0ec2f5ec94ff237b3'

  constructor(private http: HttpClient) { }

  public getUsers() {
    return this.http.get<User[]>(this.API + '/public/v2/users?access-token='+ this.access_Token);
  }

  public createUser(userData) {
    return this.http.post<User>(this.API + '/public/v2/users?access-token='+ this.access_Token, userData);
  }

  public updateUser(userData) {
    return this.http.patch<User>(this.API +'/public/v2/users/'+ userData.id +'?access-token='+ this.access_Token,userData);
  }

  public deleteUser(userId) {
    return this.http.delete(this.API +'/public/v2/users/'+ userId +'?access-token='+ this.access_Token);
  }
}
