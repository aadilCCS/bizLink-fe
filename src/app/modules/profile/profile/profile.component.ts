import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BreadCrumbComponent } from 'app/modules/shared/bread-crumb/bread-crumb.component';
import { UtilService } from 'app/service/util.service';
import { AddressService } from 'app/service/address.service';
import { Address } from 'app/models/address';
import { OrderService } from 'app/service/order.service';
import { MatTableDataSource } from '@angular/material/table';
import { Order } from 'app/models/order';
import { MaterialModule } from 'app/modules/materials/material.module';
import { DROPDOWN_TYPE } from 'app/enums/form-enum';
import { SearchDropdownComponent } from 'app/modules/shared/search-dropdown/search-dropdown.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ReturnOrderComponent } from 'app/modules/shared/return-order/return-order.component';
import { Const } from 'app/const';
import { DeleteConfirmationComponent } from 'app/modules/shared/delete-confirmation/delete-confirmation.component';

interface StatusOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, BreadCrumbComponent, MaterialModule, SearchDropdownComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  DROPDOWN_TYPE = DROPDOWN_TYPE;

  profileForm!: FormGroup;
  isProfileEdit: boolean = false;
  LoggedInUserData: any;
  addressDetail: Address | null = null;
  tabView: string = 'profile';
  dataSource = new MatTableDataSource<Order>();
  displayedColumns: string[] = ['buyerGst', 'buyerName', 'invoiceNo', 'invoiceDate', 'status', 'action'];
  currentUserRole: any;


  // This will be the full list of all possible statuses
  public buyerStatusOptions: StatusOption[] = [
    { id: 'pending', name: 'pending' },
    { id: 'confirmed', name: 'Confirmed' },
    { id: 'shipped', name: 'Shipped' },
    { id: 'received', name: 'received' },
    { id: 'cancelled', name: 'cancelled' },
    { id: 'return', name: 'return' },
  ];
  public buyerStatusSequence = ['pending', 'confirmed', 'shipped', 'received', 'return', 'cancelled'];

  constructor(
    private fb: FormBuilder,
    private _utilService: UtilService,
    private _addressService: AddressService,
    private _orderService: OrderService,
    private _matSnackBar: MatSnackBar,
    private _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.initForm();

    this._utilService.loginChangeObx.subscribe((user: any) => {
      this.LoggedInUserData = user;
      if (user && Object.keys(user).length) {
        this.currentUserRole = user.role.role;
        this.getAdd(user.address);
        this.getOrdersList();
      }
    })
  }

  async getAdd(id: any) {
    this.addressDetail = await this._addressService.getAddressById(id);
  }

  async getOrdersList() {
    const result = await this._orderService.getOrderList(this.LoggedInUserData.id);
    this.dataSource.data = result;
  }

  initForm() {
    this.profileForm = this.fb.group({
      firstName: ['Md', Validators.required],
      lastName: ['Rimel', Validators.required],
      email: ['rimel1111@gmail.com', [Validators.required, Validators.email]],
      address: ['Kingston, 5236, United State', Validators.required],
      currentPassword: [''],
      newPassword: [''],
      confirmNewPassword: ['']
    });
  }

  getFullAdd(address: Address | null) {
    return `${address?.address1 ?? '-'}, ${address?.address2 ?? '-'}, ${address?.city.name ?? '-'}, ${address?.state.name ?? '-'}, ${address?.country.name ?? '-'} - ${address?.pinCode ?? '-'}`;
  }


  getOptionsForOrderItem = (itemStatus: string, orderStatus?: string): StatusOption[] => {
    const enabledOptions: StatusOption[] = [];
    const currentStatusObj = this.buyerStatusOptions.find(s => s.id === itemStatus);
    if (currentStatusObj) {
      enabledOptions.push(currentStatusObj);
      if (orderStatus === 'confirmed' || orderStatus === 'shipped' || orderStatus === 'delivered') {
        const currentIndex = this.buyerStatusSequence.indexOf(currentStatusObj.id);
        if (currentIndex !== -1 && currentIndex < this.buyerStatusSequence.length - 1) {
          const nextStatusId = this.buyerStatusSequence[currentIndex + 1];
          const nextStatusObj = this.buyerStatusOptions.find(s => s.id === nextStatusId);
          if (nextStatusObj) {
            enabledOptions.push(nextStatusObj);
          }
        }
      }
    }

    // Always include cancelled status
    const cancelledStatus = this.buyerStatusOptions.find(s => s.id === 'cancelled');
    if (cancelledStatus && !enabledOptions.find(option => option.id === 'cancelled')) {
      enabledOptions.push(cancelledStatus);
    }

    return enabledOptions;
  }

  async onChangeEStatus(event: any, item: Order) {
    try {
      let dialogData: boolean = false;

      if (event === 'return') {
        dialogData = await this.returnOrder(item, 'return');
      }


      if (event === 'cancelled') {
        dialogData = await this.returnOrder(item, 'cancelled');
      }
      if (!dialogData) {
        return;
      }
      if (dialogData) {
        const data = this.currentUserRole === 'buyer' ? { buyerStatus: event } : { status: event };
        await this._orderService.updateOrder(item.id, data);
        this.getOrdersList();
      }

      // if (!dialogData && event !== 'received' && event !== 'return') {
      // const data = { buyerStatus: event };
      // await this._orderService.updateOrder(item.id, data);
      // this.getOrdersList();
      // }
    } catch (error: any) {
      this._utilService.showErrorSnack(this._matSnackBar, error.error.message);
    }
  }

  async returnOrder(item: Order, action: 'return' | 'cancelled') {
    const dialogRef = this._dialog.open(ReturnOrderComponent, {
      ...{
        data: {
          item,
          action
        },
        autoFocus: false,
        maxWidth: '800px',
        ...Const.commonDialogParams
      },
      ...Const.commonDialogParams,
    });
    const result = await dialogRef.afterClosed().toPromise();
    return result;
  }

  changeTab(tabName: string) {
    this.tabView = tabName;
  }

  async generatePDF(id: any, orderNumber: any) {
    try {
      const response = await this._orderService.exportPdf(id);
      const blobFileName = `${orderNumber ? orderNumber.replaceAll('/', '-') : 'order'}.pdf`;
      this._utilService.saveAsFile(response, blobFileName);
    } catch (error: any) {
      this._utilService.showErrorSnack(this._matSnackBar, error?.error?.message)
    }
  }

  onDelete(item: Order): void {
    const dialogRef = this._dialog.open(DeleteConfirmationComponent, {
      ...{
        data: { module: 'order' },
        autoFocus: false,
      },
      ...Const.commonDialogParams,
    });
    dialogRef.afterClosed().subscribe(async (data) => {
      if (data) {
        try {
          await this._orderService.deleteOrder(item.id);
          this.getOrdersList();
        } catch (error: any) {
          this._utilService.showErrorSnack(this._matSnackBar, error.error.message);
        }
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log('Form Submitted', this.profileForm.value);
      // Implement save logic here
    }
  }

  onCancel() {
    this.profileForm.reset({
      firstName: 'Md',
      lastName: 'Rimel',
      email: 'rimel1111@gmail.com',
      address: 'Kingston, 5236, United State',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
  }
}
