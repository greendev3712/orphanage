import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DonationsRoutingModule } from './donations-routing.module';
import { DonationsComponent } from './donations.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DonationsComponent
  ],
  imports: [
    CommonModule,
    DonationsRoutingModule,
    FormsModule
  ]
})
export class DonationsModule { }
