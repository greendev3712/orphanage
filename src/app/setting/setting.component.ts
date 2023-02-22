import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { User } from '../_models/User';
import { UserService } from '../_service/user.service';
import { TokenStorageService } from '../_service/token-storage.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  constructor(public globalService: GlobalService,private userService:UserService,private token: TokenStorageService) { }
  user: User = new User();
  ngOnInit(): void {
    this.user = this.token.getUser();
    console.log(this.user)
  }
  save(user:User){  
    console.log(user)
      this.userService.updateUser(user).subscribe(result=>{
        console.log(result)
        if(result.token){
          this.globalService.showError("user profile was successfully updated");
        }
      },error => {
        this.globalService.showError(error.error.message);
      });
  }
}
