import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './modules/layout/layout.component';
import { CompanyService } from './service/company.service';
import { UtilService } from './service/util.service';
import { Subject, takeUntil } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { LoaderComponent } from './modules/shared/loader/loader.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'front';
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _companyService: CompanyService,
    private _utilService: UtilService,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.loadServices();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  async loadServices() {
    await this._companyService.saveCompanyDetailsInTheLocalStorage();

    this._utilService.companySettingChangeObx
      .pipe((takeUntil(this._unsubscribeAll)))
      .subscribe((it) => {
        if (it?.companyName) {
          this.titleService.setTitle("[ " + it?.companyName + " ] Administration Server");
        }
      });
  }
}
