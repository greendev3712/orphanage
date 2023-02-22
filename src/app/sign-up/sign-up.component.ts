import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_service/auth.service';
import { TokenStorageService } from '../_service/token-storage.service';
import { User } from '../_models/User' 
import { GlobalService } from '../global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  user: User = new User();

  constructor(private authService:AuthService,private tokenStorageService:TokenStorageService,public globalService:GlobalService,private router: Router) { }

  ngOnInit(): void {

    
  }

  register(user:any){
    this.authService.register(user).subscribe(result=>{
      // console.log(result)
      if(result){
         this.tokenStorageService.saveToken(result.token)
         this.tokenStorageService.saveUser(result)
         this.globalService.showSuccess("Registration Successful");
        this.router.navigate(['/']);

      }
    },error => {
      console.log(error)
      this.globalService.showError(error);
    });
  }
}
