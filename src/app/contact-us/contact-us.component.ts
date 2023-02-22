import { Component, OnInit } from '@angular/core';
import { MessageService } from '../_service/message.service';
import { TokenStorageService } from '../_service/token-storage.service';


@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit { 
  message = {
    first_name:'',
    last_name:'',
    email:'',
    phone_no:'',
    content:''
  }

  Messages:any;
  tableSize: number;
  page: number;
  count: any;

  constructor(
    private messageService:MessageService, 
    public token: TokenStorageService
  ) { 
    this.page = 1;
    this.tableSize = 10;
  }

  ngOnInit(): void {
    this.setTable(this.page,this.tableSize);
  }

  sendMessage(data:any){
    console.log(data)
    this.messageService.sendMessage(data).subscribe(result=>{
      this.message = {
        first_name:'',
        last_name:'',
        email:'',
        phone_no:'',
        content:''
      }
      alert("Your message has been archived - Thank you!");
    })
  }
  
  onTableDataChange(event:any){
    this.setTable(event,this.tableSize);
  }

  setTable(page: number,tableSize: number){
    this.messageService.getMessages(page,tableSize).subscribe(result=>{
      this.Messages = result.items;
      this.tableSize = result._meta.per_page;
      this.page = result._meta.page;
      this.count = result._meta.total_items;
    })
  }

}
