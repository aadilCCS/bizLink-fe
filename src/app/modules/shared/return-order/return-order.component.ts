import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { cloneDeep } from "lodash";
import { NgDateTimePickerComponent } from "../ng-date-time-picker/ng-date-time-picker.component";
import { MaterialModule } from "app/modules/materials/material.module";
import { UtilService } from "app/service/util.service";
import { MediaService } from "app/service/media.service";
import { ReturnOrderService } from "app/service/return-order.service";
import { OrderService } from "app/service/order.service";

@Component({
  selector: 'app-return-order',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgDateTimePickerComponent,
  ],
  templateUrl: './return-order.component.html',
  styleUrls: ['./return-order.component.scss']
})
export class ReturnOrderComponent {
  form!: FormGroup;
  cancelOrderform!: FormGroup;
  submitEnable: boolean = true;
  paymentAmount: number = 0;
  paymentDate: Date = new Date();
  remarks: string = '';

  constructor(
    private dialogRef: MatDialogRef<ReturnOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private _utilService: UtilService,
    public _mediaService: MediaService,
    private _matSnackBar: MatSnackBar,
    private _returnOrderService: ReturnOrderService,
    private _orderService: OrderService,
    // private _paymentService: PaymentService,
  ) {
    this.paymentAmount = data?.item?.item[0]?.grandTotal || 0;
    console.log("data >>,", data);
    
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.form = this._fb.group({
      orderNo: new FormControl(this.data.item.orderNumber, [Validators.required]),
      reason: new FormControl(null, [Validators.required]),
      comment: new FormControl(null),
      pickupDate: new FormControl(null, [Validators.required]),
    });

    this.cancelOrderform = this._fb.group({
      orderNo: new FormControl(this.data.item.orderNumber, [Validators.required]),
      reason: new FormControl(null, [Validators.required]),
    });

    this.form.get("orderNo")?.disable(); // Disable the orderNo field
    this.cancelOrderform.get("orderNo")?.disable(); // Disable the orderNo field
  }

  get f() {
    return this.form.controls;
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    var payload = cloneDeep(this.form.value);
    payload.orderNo = this.data.item.orderNumber;
    try {
      this.submitEnable = false;
      const response: any = await this._returnOrderService.createReturnOrder(this.data.item.id, payload);
      this._utilService.showSuccessSnack(this._matSnackBar, response.message);
      this.dialogRef.close(true);
    } catch (error:any) {
      this._utilService.showErrorSnack(this._matSnackBar, error.error.message);
    } finally {
      this.submitEnable = true;
    }
  }

  async oncancelFormSubmit() {
    if (this.cancelOrderform.invalid) {
      this.cancelOrderform.markAllAsTouched();
      return;
    }

    var payload = cloneDeep(this.cancelOrderform.value);
    try {
      this.submitEnable = false;
      const response: any = await this._orderService.cancelOrder(this.data.item.id, payload);
      this._utilService.showSuccessSnack(this._matSnackBar, response.message);
      this.dialogRef.close(true);
    } catch (error:any) {
      this._utilService.showErrorSnack(this._matSnackBar, error.error.message);
    } finally {
      this.submitEnable = true;
    }
  }

  async payment() {
    // try {
    //   const payload: any = {
    //     paidAmount: this.paymentAmount,
    //     orderId: this.data.item.id,
    //     paymentDate: this.paymentDate,
    //     remarks: this.remarks,
    //   };

    //   await this._paymentService.createPayment(payload);
    //   this._utilService.showSuccessSnack(this._matSnackBar, 'Payment Successful!');
    //   this.dialogRef.close(true);
    // } catch (error) {
    //   this._utilService.showErrorSnack(this._matSnackBar, error.error.message);
    // }
  }

  closeModal() {
    this.dialogRef.close(false);
  }

}
