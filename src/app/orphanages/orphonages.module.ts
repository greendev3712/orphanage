import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { OrphonagesRoutingModule } from './orphonages-routing.module';
import { RouterModule } from '@angular/router';
import { OrphanageDetailComponent } from './orphanage-detail/orphanage-detail.component';
import { BrowserModule } from '@angular/platform-browser';
import { OrphanagesComponent } from './orphanages.component';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { SafePipe } from '../_pipes/safe.pipe';
import { ArraysortPipe } from '../_pipes/arraysort.pipe';

import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [OrphanageDetailComponent, OrphanagesComponent,AutocompleteComponent,SafePipe,ArraysortPipe],
  imports: [
    CommonModule,
    OrphonagesRoutingModule,
    RouterModule,
    AngularEditorModule,
    FormsModule
  ]
})
export class OrphonagesModule { }
