import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PaymentComponent } from './payment/payment.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', loadChildren: () => import("./login/login.module").then(m => m.LoginModule) },
  { path: 'signUp', loadChildren: () => import("./sign-up/sign-up.module").then(m => m.SignUpModule) },
  { path: 'aboutUs', loadChildren: () => import("./about-us/about-us.module").then(m => m.AboutUsModule) },
  { path: 'contactUs', loadChildren: () => import("./contact-us/contact-us.module").then(m => m.ContactUsModule) },
  { path: 'orphenages', loadChildren: () => import("./orphanages/orphonages.module").then(m => m.OrphonagesModule) },
  { path: 'userprofile', loadChildren: () => import("./setting/setting.module").then(m => m.SettingModule) },
  { path: 'donations', loadChildren: () => import("./donations/donations.module").then(m => m.DonationsModule) },

  //{ path: 'paypal', loadChildren: () => import ("./paypal/paypal.module").then(m => m.PaypalRoutingModule) },
  // { path: 'donate', component:PaypalComponent },
  { path: 'donate', component: PaymentComponent },
  // { path: 'paypal', loadChildren: () => import("./paypal/paypal.module").then(m => m.PaypalRoutingModule) },

  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
