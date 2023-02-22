import { Injectable } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { render } from 'creditcardpayments/creditCardPayments';
import { environment } from 'src/environments/environment';

import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {Orphonage} from './_models/Orphonage'

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  where = '';
  showMenu = false;
  donate = false;
  closeModal: string = '';
  paypal_info: string = '';
  web_site = environment.web_site;
  amount: any;
  global_orphonages: Orphonage[] = [];
  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  constructor(private modalService: NgbModal, private toastr: ToastrService) { }

  triggerModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
    });
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public close() {
    this.modalService.dismissAll();
  }

  showSuccess(msg: any) {
    this.toastr.success(msg);
  }

  showError(msg: any) {
    this.toastr.error(msg);
  }

  donne(orphanage: any) {
    this.donate = true;
    this.changeMessage(orphanage)
  }

  getSize(text: any, size: number) {
    if (text && text.length > size) {
      return text.slice(0, size) + '...'
    } else {
      return text;
    }
  }

  changeMessage(message: string) {
    this.messageSource.next(message)
  }

}
