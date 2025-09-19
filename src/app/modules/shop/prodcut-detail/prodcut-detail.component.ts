import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../../models/product';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SecureImagePipe } from 'app/pipe/secure-image.pipe';
import { ProductService } from 'app/service/product.service';
import { DomSanitizer } from '@angular/platform-browser';
import { BreadCrumbComponent } from 'app/modules/shared/bread-crumb/bread-crumb.component';
import { DROPDOWN_TYPE } from 'app/enums/form-enum';
import { MaterialModule } from 'app/modules/materials/material.module';
import { HttpParams } from '@angular/common/http';
import { SidenavService } from 'app/modules/shared/sidenav/sidenav.service';
import { UtilService } from 'app/service/util.service';
import { CompanySettings } from 'app/models/company';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalService } from 'app/service/global.service';
import { BarRatingModule, BarRatingEffect } from 'ngx-bar-rating';
import { ReviewService } from 'app/service/review.service';
import { Review } from 'app/models/review';
import { WishlistService } from 'app/service/wishlist.service';
import { AddToCartService } from 'app/service/add-to-cart.service';

@Component({
  selector: 'app-prodcut-detail',
  imports: [
    CommonModule,
    BreadCrumbComponent,
    FormsModule,
    SecureImagePipe,
    MaterialModule,
    BarRatingModule,
    BarRatingEffect,
    ReactiveFormsModule,
  ],
  templateUrl: './prodcut-detail.component.html',
  styleUrl: './prodcut-detail.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class ProdcutDetailComponent implements OnInit {

  reviewForm!: FormGroup;
  DROPDOWN_TYPE = DROPDOWN_TYPE;
  currentItemId: string | null = null;
  productDetails: Product | any = {};
  productModelDetail: any = {};
  productModel: any = [];
  relatedProduct: Product | any = [];
  productQuantity: number | any = 1;
  companyDetail: CompanySettings | null = null;
  reviewList: Review | any = [];
  isUserLoggedIn: boolean = false;

  // Track selected variant values per model and variant group
  selectedVariants: { [modelId: string]: { [variantNameId: string]: string[] } } = {};

  constructor(
    private _fb: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _productService: ProductService,
    // private _cartService: CartService,
    private _matSnackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private _router: Router,
    private sidenavService: SidenavService,
    private _utilService: UtilService,
    public _globalService: GlobalService,
    private _reviewService: ReviewService,
    private _wishlistService: WishlistService,
    private _addToCartService: AddToCartService,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this._activatedRoute.paramMap.subscribe((params) => {
      this.currentItemId = params.get("id");
      this.loadPreData();
    });

    this._utilService.companySettingChangeObx.subscribe((data) => {
      this.companyDetail = data;
    });

    this._utilService.loginChangeObx.subscribe((user) => {
      this.isUserLoggedIn = !!user;
    })
  }

  initializeForm() {
    this.reviewForm = this._fb.group({
      rating: new FormControl(0, [Validators.required]),
      comment: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  async loadPreData() {
    try {
      if (this.currentItemId) {
        const result: any = await this._productService.getProductById(this.currentItemId);
        this.productDetails = result?.product;
        this.getReview();

        if (this.productDetails?.model && this.productDetails?.model.length > 0) {
          this.productModel = this.productDetails?.model;
          this.productModelDetail = this.productModel[0];
        }
        this.relatedProduct = result?.relatedProducts;
        const wishlist = this.isUserLoggedIn ? await this._wishlistService.getWishlistAll(this.filterParams()) : [];
        const cartItem: any = this.isUserLoggedIn ? await this._addToCartService.getCartItem() : [];
        this.relatedProduct.forEach((product: any) => {
          if(this.isUserLoggedIn){
            product['isWishlisted'] = false;
            product['isAddToCart'] = false;
            if (this.isUserLoggedIn) {
              wishlist.forEach((wish: any) => {
                if (wish.productId && wish.productId.id === product.id) {
                  product['isWishlisted'] = true;
                }
  
                this.productDetails['isWishlisted'] = false;
                if (wish.productId && wish.productId.id === this.productDetails.id) {
                  this.productDetails['isWishlisted'] = true;
                }
              });
              cartItem.forEach((cart: any) => {
                if (cart.productId && cart.productId.id === product.id) {
                  product['isAddToCart'] = true;
                }
              });
            }
          }
          product.model.forEach((model: any) => {
            const price1 = model.moqs[0]?.price ?? null;
            const price2 = model.moqs[1]?.price ?? null;
            if (price2 && price2 !== price1) {
              product.priceRange = `${price1} - ${price2}`;
            } else {
              product.priceRange = `${price1}`;
            }
            product.minOrder = model.moqs[0]?.min;
          });
        });

        this.reviewForm.patchValue({
          rating: this.productDetails.ratings || 3.5,
        })
      }
    } catch (error: any) {
      this._utilService.showErrorSnack(this._matSnackBar, error.error.message);
    }
  }

  async getReview() {
    try {
      if (this.productDetails.id) {
        this.reviewList = await this._reviewService.getReview(this.productDetails.id);
      }
    } catch (error: any) {
      this._utilService.showErrorSnack(this._matSnackBar, error.error.message);
    }
  }

  goTo(path: string) {
    this._router.navigate([path]);
  }

  replceString(word: any) {
    if (!word) { return; }
    return this.magic(word.replaceAll('&lt;', '<'));
  }

  magic(word: string) {
    return this.sanitizer.bypassSecurityTrustHtml(word);
  }

  filterParams(productId?: string, modelId?: string): HttpParams {
    let params = new HttpParams();

    if (productId && productId !== '') {
      params = params.append('productId', productId ?? '');
      params = params.append('modelId', modelId ?? '');
    }
    params = params.append('limit', 6);
    return params;
  }

  addToCart() {
    if (!this.selectedVariants || Object.keys(this.selectedVariants).length === 0) {
      this._utilService.showErrorSnack(this._matSnackBar, "Please select Variant!");
      return;
    }

    const data = {
      product: this.productDetails,
      selectedVariants: this.selectedVariants
    };
    this.sidenavService.open(data);
  }

  async selectedModel(modelId: any) {
    this.productModelDetail = await this._productService.getModelById(this.filterParams(this.productDetails.id, modelId));
  }

  // Method to toggle a variant value selection for a specific model
  selectVariant(modelId: string, variantNameId: string, variantValueId: string) {
    if (!this.selectedVariants[modelId]) {
      this.selectedVariants[modelId] = {};
    }
    if (!this.selectedVariants[modelId][variantNameId]) {
      this.selectedVariants[modelId][variantNameId] = [];
    }
    const index = this.selectedVariants[modelId][variantNameId].indexOf(variantValueId);
    if (index === -1) {
      this.selectedVariants[modelId][variantNameId].push(variantValueId);
    } else {
      this.selectedVariants[modelId][variantNameId].splice(index, 1);
    }
  }

  async onSubmit() {
    const payload = {
      productId: this.productDetails.id,
      comment: this.reviewForm.value.comment,
      rating: this.reviewForm.value.rating,
    };

    try {
      const response: any = await this._reviewService.addReview(this.productDetails.id, payload);
      this._utilService.showSuccessSnack(this._matSnackBar, response.message);
      this.reviewForm.patchValue({ comment: null });
    } catch (error: any) {
      this._utilService.showErrorSnack(this._matSnackBar, error.error.messsage);
    }

  }
}

