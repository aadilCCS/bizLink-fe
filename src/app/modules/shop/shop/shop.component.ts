import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialsModule } from 'app/materials/materials.module';
import { Category } from 'app/models/category';
import { PaginationModel } from 'app/models/common';
import { Product } from 'app/models/product';
import { BreadCrumbComponent } from 'app/modules/shared/bread-crumb/bread-crumb.component';
import { SecureImagePipe } from 'app/pipe/secure-image.pipe';
import { CategoryService } from 'app/service/category.service';
import { GlobalService } from 'app/service/global.service';
import { ProductService } from 'app/service/product.service';
import { UtilService } from 'app/service/util.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { BarRatingModule, BarRatingEffect } from 'ngx-bar-rating';
import { WishlistService } from 'app/service/wishlist.service';
import { AddToCartService } from 'app/service/add-to-cart.service';
import { FormsModule } from '@angular/forms';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { FileTransferService } from 'app/service/file-transfer.service';
import { Subject, takeUntil, distinctUntilChanged, debounceTime } from 'rxjs';

@Component({
  selector: 'app-shop',
  imports: [
    CommonModule,
    SecureImagePipe,
    MaterialsModule,
    BreadCrumbComponent,
    NgxSkeletonLoaderModule,
    NgxSliderModule,
    FormsModule,
    BarRatingModule,
    BarRatingEffect,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  productList: Product | any = null;
  categoryList: Category | any = null;
  paramsKeyword: string | null = null;
  pagination: PaginationModel = {
    pageSizeOptions: [9, 18, 27, 36],
    pageSize: 9,
    pageIndex: 0,
  };

  minPrice: number = 100;
  maxPrice: number = 1000;
  options: Options = {
    floor: 0,
    ceil: 1000,
  };

  private destroy$ = new Subject<void>();
  private hasProcessedFile = false;
  isUserLoggedIn: boolean = false;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _utilsService: UtilService,
    private _matSnakBar: MatSnackBar,
    private _productService: ProductService,
    private _router: Router,
    private _categoryService: CategoryService,
    public _globalService: GlobalService,
    private _wishlistService: WishlistService,
    private _addToCartService: AddToCartService,
    private fileTransferService: FileTransferService,
  ) { }

  ngOnInit(): void {
    // Handle query parameters
    this._activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params?.['keyword'] && !this.pagination.pageIndex) {
          this.paramsKeyword = params?.['keyword'];
        }
        if (params?.['page'] && !this.pagination.pageIndex) {
          this.pagination.pageIndex = parseInt(params?.['page']);
        }
        if (params?.['size']) {
          this.pagination.pageSize = params?.['size'];
        }
      });

    // Handle route parameters
    this._activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const urlParams = params?.['id'];
        if (urlParams) {
          this.getList('subCategory', urlParams);
        } else {
          this.getList('', null);
        }
      });

    this._utilsService.loginChangeObx.subscribe((user) => {
      this.isUserLoggedIn = !!user;
    })

    // Handle file transfer service - only once per file
    this.fileTransferService.getFile()
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((prev, curr) => {
          if (!prev && !curr) return true;
          if (!prev || !curr) return false;
          return prev.name === curr.name && prev.size === curr.size && prev.lastModified === curr.lastModified;
        }),
        debounceTime(100)
      )
      .subscribe((file) => {
        if (file && !this.hasProcessedFile) {
          this.hasProcessedFile = true;
          this.getList('', '', file);
        } else if (!file) {
          this.hasProcessedFile = false;
        }
      });

    this.getCategory();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.fileTransferService.clearFile();
  }

  filterParams(key: string, value: string | null): HttpParams {
    let params = new HttpParams();
    if (key && value) {
      params = params.append(key, value);
    }
    params = params.append('page', this.pagination.pageIndex + 1);
    params = params.append('limit', this.pagination.pageSize);
    if (this.paramsKeyword !== null) {
      params = params.append('keyword', this.paramsKeyword);
    }
    // Add minPrice and maxPrice to params if filtering by priceRange
    if (key === 'priceRange' && value) {
      const [min, max] = value.split('-');
      params = params.append('minPrice', min);
      params = params.append('maxPrice', max);
    }
    return params;
  }


  onPriceInputChange(price: number, key: string = '') {
    if (key === 'min') {
      this.minPrice = price;
      this.getList('minPrice', this.minPrice.toString());
    } else if (key === 'max') {
      this.getList('maxPrice', this.maxPrice.toString());
      this.maxPrice = price;
    }

    // Validate minPrice and maxPrice
    if (this.minPrice > this.maxPrice) {
      const temp = this.minPrice;
      this.minPrice = this.maxPrice;
      this.maxPrice = temp;
    }

  }

  async getList(key: string, value: string | null, file?: any) {
    try {
      if (file) {
        this.productList = await this._productService.getProductsFilteredByImage(file);
      } else {
        this.productList = await this._productService.getProductsFiltered(this.filterParams(key, value));
      }
      const wishlist = this.isUserLoggedIn ? await this._wishlistService.getWishlistAll(this.filterParams('', null)) : [];
      const cartItem: any = this.isUserLoggedIn ? await this._addToCartService.getCartItem() : [];
      this.productList.items.forEach((product: any) => {
        if (this.isUserLoggedIn) {
          product['isWishlisted'] = false;
          product['isAddToCart'] = false;
          wishlist.forEach((wish: any) => {
            if (wish.productId && wish.productId.id === product.id) {
              product['isWishlisted'] = true;
            }
          });
          cartItem.forEach((cart: any) => {
            if (cart.productId && cart.productId.id === product.id) {
              product['isAddToCart'] = true;
            }
          });
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
        })
      });
      this.paginator.pageIndex = this.pagination.pageIndex;
      this.paginator.length = this.productList.totalResults;
    } catch (error: any) {
      this._utilsService.showErrorSnack(this._matSnakBar, error.error.message);
    }
  };

  pageChanged(event: PageEvent): void {
    this.pagination.pageSize = event.pageSize;
    this.pagination.pageIndex = event.pageIndex;
    this.getList('', null);
  }

  async getCategory() {
    try {
      this.categoryList = await this._categoryService.getCategoryList(new HttpParams());
    } catch (error: any) {
      this._utilsService.showErrorSnack(this._matSnakBar, error.error.message);
    }
  }

  goTo(path: string) {
    this._router.navigate([path]);
  }

}
