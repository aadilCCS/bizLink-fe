import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from 'app/service/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {
  loading = false;
  private subscription!: Subscription;

  constructor(private loaderService: LoaderService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subscription = this.loaderService.loaderState.subscribe(state => {
      setTimeout(() => {
        this.loading = state;
        this.cdr.detectChanges();
      });
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
