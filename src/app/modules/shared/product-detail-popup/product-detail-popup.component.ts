import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'app/modules/materials/material.module';
import { SecureImagePipe } from 'app/pipe/secure-image.pipe';
import { SearchDropdownComponent } from '../search-dropdown/search-dropdown.component';
import { DROPDOWN_TYPE } from 'app/enums/form-enum';
import { ProductService } from 'app/service/product.service';
import { HttpParams } from '@angular/common/http';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-detail-popup',
  imports: [
    SecureImagePipe,
    SearchDropdownComponent,
    MaterialModule,
  ],
  templateUrl: './product-detail-popup.component.html',
  styleUrl: './product-detail-popup.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductDetailPopupComponent implements OnInit {
  DROPDOWN_TYPE = DROPDOWN_TYPE;
  productModelDetail: any = {};
  productModel: any = [];

  constructor(
    private _dialogRef: MatDialogRef<ProductDetailPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _productService: ProductService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this.productModel = this.data?.model;
    this.productModelDetail = this.productModel[0];
  }

  isImgArr() {
    return this.data.image = Array.isArray(this.data.image) ? this.data.image[0] : this.data.image;
  }

  filterParams(productId: string, modelId: string): HttpParams {
    let params = new HttpParams();

    params = params.append('productId', productId);
    params = params.append('modelId', modelId);
    return params;
  }

  async selectedModel(modelId: any) {
    this.productModelDetail = await this._productService.getModelById(this.filterParams(this.data.id, modelId));
  }

  onSubmit() {
    this._dialogRef.close(true);
  }

  goTo(path: string) {
    this._dialogRef.close(true);
    this._router.navigate([path]);
  }

}
