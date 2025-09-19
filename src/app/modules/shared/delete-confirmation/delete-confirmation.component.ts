import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'app/modules/materials/material.module';

@Component({
	selector: 'app-delete-confirmation',
	templateUrl: './delete-confirmation.component.html',
	styleUrls: ['./delete-confirmation.component.scss'],
	standalone: true,
	imports: [MaterialModule]
})
export class DeleteConfirmationComponent implements OnInit {

	constructor(
		private _dialogRef: MatDialogRef<DeleteConfirmationComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
	) { }

	ngOnInit(): void {
	}

	onSubmit() {
		this._dialogRef.close(true);
	}
}
