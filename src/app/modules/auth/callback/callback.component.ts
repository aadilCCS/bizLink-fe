import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-callback',
  imports: [MatProgressSpinnerModule],
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  constructor(
    private oidcSecurityService: OidcSecurityService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.oidcSecurityService.checkAuth().subscribe((result) => {
      if (result.isAuthenticated) {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/sign-in']);
      }
    });
  }
}
