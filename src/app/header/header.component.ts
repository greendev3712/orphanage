import {  Component, Inject, OnDestroy, OnInit, Renderer2  } from '@angular/core';
import { GlobalService } from '../global.service';
import { DOCUMENT } from '@angular/common';
import { TokenStorageService } from '../_service/token-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
 
  constructor(public globalService:GlobalService,
              public tokenStorageService:TokenStorageService,
              @Inject(DOCUMENT) private document: Document, 
              private renderer: Renderer2) { }

  ngOnInit(): void {
  }
  getMenuSm(){
    this.globalService.showMenu = !this.globalService.showMenu;
    if(!this.globalService.showMenu){
      this.renderer.addClass(this.document.body, 'overflow-hidden');
    }else{
      this.renderer.removeClass(this.document.body, 'overflow-hidden');
    }
     
  }

 
}
