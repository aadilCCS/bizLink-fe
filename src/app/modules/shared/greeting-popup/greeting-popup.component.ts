import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../materials/material.module';

@Component({
  selector: 'app-greeting-popup',
  imports: [MaterialModule],
  templateUrl: './greeting-popup.component.html',
  styleUrl: './greeting-popup.component.scss'
})
export class GreetingPopupComponent implements OnInit {

	constructor(
		private _dialogRef: MatDialogRef<GreetingPopupComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
	) { }

	ngOnInit(): void {
	}

	onSubmit() {
		this._dialogRef.close(true);
	}
}
