import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Category } from 'app/models/category';
import { User } from 'app/models/user';
import { AuthService } from 'app/service/auth.service';
import { CategoryService } from 'app/service/category.service';
import { UtilService } from 'app/service/util.service';
import { ProductService } from 'app/service/product.service';
import { debounceTime, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CompanyService } from 'app/service/company.service';
import { CompanySettings } from 'app/models/company';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { FileTransferService } from 'app/service/file-transfer.service';
import { SecureImagePipe } from 'app/pipe/secure-image.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, FormsModule, NgxFileDropModule, SecureImagePipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  categoryList: Category | any = [];
  selectedCategory: any;
  HeaderCount: any = {};
  loggedinUser: User | any = null;
  isUserLoggedIn: boolean = false;
  isSearchbar: boolean = false;
  companyDetails: CompanySettings | null = null;
  searchQuery: string = '';
  searchResults: any[] = [];
  private searchSubject: Subject<string> = new Subject();
  public files: NgxFileDropEntry[] = [];
  isVisualImageSearchOpen: boolean = false;

  constructor(
    private _categoryService: CategoryService,
    private _authService: AuthService,
    private _router: Router,
    private _utilService: UtilService,
    private _productService: ProductService,
    private _companyService: CompanyService,
    private fileTransferService: FileTransferService,
  ) { }

  ngOnInit(): void {
    this.getCategories();
    this.getCompanyDetails();

    this._utilService.loginChangeObx.subscribe((user: any) => {
      this.loggedinUser = user;
      this.isUserLoggedIn = !!user;
    });

    if (this.isUserLoggedIn) {
      this._utilService.headerCount();
    }

    this._utilService.headerCountObx.subscribe((item) => {
      if (item) {
        this.HeaderCount = { ...item };
      }
    });

    this.searchSubject.pipe(debounceTime(300)).subscribe((searchText) => {
      this.performSearch(searchText);
      if (!searchText) {
        this.isSearchbar = false;
      }
    });
  }

  filterParams(): HttpParams {
    let params = new HttpParams();
    params = params.append('limit', 6);
    return params;
  }

  async getCategories() {
    this.categoryList = await this._categoryService.getCategoryList(this.filterParams());
    if (this.categoryList && this.categoryList.length > 0) {
      this.selectedCategory = this.categoryList[0];
    }
  }

  selectCategory(category: Category) {
    this.selectedCategory = category;
  }

  async getCompanyDetails() {
    this.companyDetails = await this._companyService.getSettings();
  }

  Logout() {
    this._authService.signOut();
    this._router.navigate(['/home']);
  }

  goTo(route: string) {
    if (route === 'register') {
      this._utilService.loginChangeObx.next(null);
    }
    this._router.navigate([route]);
  }

  onSearchInputChange() {
    this.searchSubject.next(this.searchQuery);
  }

  async performSearch(query: string) {
    if (!query || query.trim().length === 0) {
      this.searchResults = [];
      return;
    }
    let params = new HttpParams();
    params = params.append('keyword', query);
    try {
      const result: any = await this._productService.getProductsFiltered(params);
      this.searchResults = result || [];
      this.isSearchbar = true;
    } catch (error) {
      this.searchResults = [];
      this.isSearchbar = false;
    }
  }

  onSearchSubmit() {
    if (this.searchQuery && this.searchQuery.trim().length > 0) {
      this.isSearchbar = false;
      this.isVisualImageSearchOpen = false;
      this._router.navigate(['/shop'], { queryParams: { keyword: this.searchQuery.trim() } });
      this.searchQuery = '';
    }
  }

  openVisualImageSearch() {
    this.isVisualImageSearchOpen = true;
  }

  closeVisualImageSearch() {
    this.isVisualImageSearchOpen = false;
  }
  
  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file(async (file: File) => {
          this.fileTransferService.setFile(file);
          this.isVisualImageSearchOpen = false;
          this._router.navigate(['/shop']);
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }
}
