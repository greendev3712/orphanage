import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../global.service';
import { Orphonage } from '../_models/Orphonage';
import { OrphonageService } from '../_service/orphonage.service';
import { TokenStorageService } from '../_service/token-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public globalService:GlobalService,private orphonageService:OrphonageService,private router: Router,public token: TokenStorageService) { }
  images:any;
  heightScreen:any;
  orphonages:Orphonage[] = [];

  ngOnInit(): void {
    this.heightScreen = window.innerHeight - 120 - 120;
    this.images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
    this.getAllOrphonage();
  }

  getAllOrphonage(){
    this.orphonageService.getAllOrphonage().subscribe(result=>{

      // this.orphonages = result.items;
      // this.orphonages = this.orphonages.slice(0,3)
      this.globalService.global_orphonages = result.items;
      this.orphonages = result.items.slice(0, 3);
      // this.orphonages.map(item=>{
      //   item.location = JSON.parse(item.location)     
      // })
    })
  }
  goToDetails(orphonage:any){
    this.orphonageService.orphonage = orphonage;
    this.router.navigate(['/orphenages/orphanageDetail']);
  }
  goToDonate(orphonage:any){
    this.orphonageService.orphonage = orphonage;
    this.router.navigateByUrl('/donate', { state: this.orphonageService.orphonage });
  }
}
