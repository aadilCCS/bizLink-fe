import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchDropdownComponent } from '../shared/search-dropdown/search-dropdown.component';

const routes: Routes = [
  { path: "", component: ProfileComponent },
];


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProfileComponent,
    SearchDropdownComponent,
    RouterModule.forChild(routes),
  ]
})
export class ProfileModule { }
