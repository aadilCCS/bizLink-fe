import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../materials/material.module';
import { RouterModule, Routes } from '@angular/router';
import { BuyerListComponent } from './buyer-list/buyer-list.component';

const routes: Routes = [
  { path: '', component: BuyerListComponent },
]


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes),
    BuyerListComponent
  ]
})
export class BuyerListModule { }
