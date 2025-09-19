import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { UtilService } from 'app/service/util.service';
import { Subscription } from 'rxjs';

import { SidenavComponent } from 'app/modules/shared/sidenav/sidenav.component';
import { Router } from '@angular/router';
import { ChatComponent } from 'app/modules/shared/chat/chat.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, SidenavComponent, ChatComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  routeUrlName: string = '';
  private subscription!: Subscription;

  constructor(
    private _utilService: UtilService,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscription = this._utilService.loginChangeObx.subscribe(user => {
      this.isLoggedIn = !!user;
    });

    this.router.events.subscribe((res) => {
      this.routeUrlName = this.router.url;
      if (this.router.url === '/register') {
        this._utilService.loginChangeObx.next(null);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
