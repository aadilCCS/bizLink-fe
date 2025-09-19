import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatTreeModule} from '@angular/material/tree';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { MatNativeDateModule } from '@angular/material/core';

const MaterialComponents = [
  MatSidenavModule,
  MatToolbarModule,
  MatExpansionModule,
  MatListModule,
  MatCardModule,
  MatIconModule,
  MatButtonModule,
  MatProgressBarModule,
  MatPaginatorModule,
  MatTableModule,
  MatTabsModule,
  MatProgressSpinnerModule,
  MatMenuModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatCheckboxModule,
  MatTooltipModule,
  MatSelectModule,
  MatDatepickerModule,
  MatRadioModule,
  MatSnackBarModule,
  MatAutocompleteModule,
  MatChipsModule,
  MatButtonToggleModule,
  MatTreeModule,
  MatBottomSheetModule,
  MatBadgeModule,
  MatSlideToggleModule,
  MatSortModule,
  ClipboardModule,
  MatNativeDateModule
];
@NgModule({
  declarations: [],
  imports: [CommonModule, ...MaterialComponents],
  exports: [CommonModule, ...MaterialComponents],
})
export class MaterialModule {}
