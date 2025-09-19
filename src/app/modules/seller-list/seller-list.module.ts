import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../materials/material.module';
import { RouterModule, Routes } from '@angular/router';
import { SellerListComponent } from './seller-list/seller-list.component';

const routes: Routes = [
  { path: ':id', component: SellerListComponent },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    SellerListComponent,
    RouterModule.forChild(routes),
  ]
})
export class SellerListModule { }
