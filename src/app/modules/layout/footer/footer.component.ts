import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'app/models/category';
import { CompanySettings } from 'app/models/company';
import { SecureImagePipe } from 'app/pipe/secure-image.pipe';
import { CategoryService } from 'app/service/category.service';
import { CompanyService } from 'app/service/company.service';
import { UtilService } from 'app/service/util.service';

@Component({
  selector: 'app-footer',
  imports: [
    CommonModule,
    SecureImagePipe
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {

  categoryList: Category | any = [];
  companyDetails: CompanySettings | null = null;
  isUserLoggedIn: boolean = false;

  constructor(
    private _categoryService: CategoryService,
    private _companyService: CompanyService,
    private _router: Router,
    private _utilService: UtilService,
  ) { }

  ngOnInit(): void {
    this.getCategories();
    this.getCompanyDetails();

    this._utilService.loginChangeObx.subscribe((user: any) => {
      this.isUserLoggedIn = !!user;
    });
  }

  filterParams(): HttpParams {
    let params = new HttpParams();
    params = params.append('limit', 6);
    return params;
  }

  async getCategories() {
    this.categoryList = await this._categoryService.getCategoryList(this.filterParams());
  }

  async getCompanyDetails() {
    this.companyDetails = await this._companyService.getSettings();
  }

  goTo(route: string) {
    this._router.navigate([route]);
  }


}
