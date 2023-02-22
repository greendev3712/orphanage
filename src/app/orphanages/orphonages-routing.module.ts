import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrphanagesComponent } from './orphanages.component';
import { OrphanageDetailComponent } from './orphanage-detail/orphanage-detail.component';

const routes: Routes = [
  
      { path: '', component: OrphanagesComponent },
      { path: 'orphanageDetail', component: OrphanageDetailComponent },  
 
  ];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrphonagesRoutingModule { }
