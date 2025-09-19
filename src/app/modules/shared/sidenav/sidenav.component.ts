import { Component, signal, ViewChild } from '@angular/core';
import { MaterialModule } from 'app/modules/materials/material.module';
import { SidenavService } from './sidenav.service';
import { MatSidenav } from '@angular/material/sidenav';
import { OnInit } from '@angular/core';
import { Product } from 'app/models/product';
import { SecureImagePipe } from 'app/pipe/secure-image.pipe';
import { CommonModule } from '@angular/common';
import { AddToCart } from 'app/models/add-to-cart';
import { AddToCartService } from 'app/service/add-to-cart.service';
import { UtilService } from 'app/service/util.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-sidenav',
  imports: [
    CommonModule,
    MaterialModule,
    SecureImagePipe
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnInit {

  @ViewChild('snav') sidenav!: MatSidenav;
  productDetails: Product | any = null;

  // Track quantity per model by model id
  quantities: { [modelId: string]: number } = {};
  selectedVariants: any;
  selecrtedVariantForApi: any;
  modelVariantsMap: { [modelId: string]: { name: string; value: string }[] } = {};
  isUserLoggedIn: boolean = false;

  constructor(
    private sidenavService: SidenavService,
    private _cartService: AddToCartService,
    private _utilService: UtilService,
    private _matSnackBar: MatSnackBar,
    private _dialog: MatDialog,
  ) { }

  ngOnInit() {
    this._utilService.loginChangeObx.subscribe((user) => {
      this.isUserLoggedIn = !!user;
    })


    this.sidenavService.sidenavToggle$.subscribe(action => {
      this.selectedVariants = action.selectedVariants || {};

      // Ensure all values are arrays for multiple selections
      for (const key in this.selectedVariants) {
        if (!Array.isArray(this.selectedVariants[key])) {
          this.selectedVariants[key] = [this.selectedVariants[key]];
        }
      }
      this.selecrtedVariantForApi = Object.entries(this.selectedVariants).map(([key, value]) => ({
        variantName: key,
        variantValue: value
      }));

      this.productDetails = action.product;

      // Initialize quantities for each model to 1
      if (this.productDetails?.model) {
        this.productDetails.model.forEach((model: any) => {
          this.quantities[model._id] = 0;
        });
        this.recalculateSubtotals();
      }

      // Precompute modelVariantsMap for template use
      this.modelVariantsMap = this.getSelectedVariantDisplay();

      if (action.action === 'open') {
        this.sidenav.open();
      } else if (action.action === 'close') {
        this.sidenav.close();
      }
    });

  }

  getSelectedVariantDisplay() {
    const modelVariantsMap: { [modelId: string]: { name: string; value: string }[] } = {};
    if (!this.productDetails?.model) {
      return modelVariantsMap;
    }

    for (const model of this.productDetails.model) {
      const displayVariants: { name: string; value: string }[] = [];
      const selectedVariantArray = this.selectedVariants[model._id];
      if (!selectedVariantArray || !Array.isArray(selectedVariantArray)) {
        modelVariantsMap[model._id] = displayVariants;
        continue;
      }
      // selectedVariantArray is an array of objects with variantNameId keys
      for (const variantObj of selectedVariantArray) {
        for (const variant of model.variant) {
          const variantName = variant.variantName.name;
          const variantNameId = variant.variantName.id;
          if (!variantObj[variantNameId]) {
            continue;
          }
          for (const variantValue of variant.variantValue) {
            if (variantObj[variantNameId].includes(variantValue.id)) {
              displayVariants.push({ name: variantName, value: variantValue.value });
            }
          }
        }
      }
      modelVariantsMap[model._id] = displayVariants;
    }
    return modelVariantsMap;
  }


  getFirstMoqMin(model: any) {
    if (model.moqs && model.moqs.length > 0) {
      return `${model.moqs[0].min} - ${model.moqs[0].max}`;
    }
    return null;
  }

  // Get price for given quantity based on MOQ tiers
  getPriceForQuantity(model: any, quantity: number): number {
    if (!model?.moqs || model.moqs.length === 0) {
      return 0;
    }
    // Sort moqs by min ascending to be safe
    const sortedMoqs = model.moqs.sort((a: any, b: any) => a.min - b.min);
    for (let i = 0; i < sortedMoqs.length; i++) {
      const moq = sortedMoqs[i];
      if (quantity <= moq.max) {
        return moq.price;
      }
    }
    // If quantity exceeds all max, return price of last moq
    return sortedMoqs[sortedMoqs.length - 1].price;
  }

  recalculateSubtotals() {
    if (this.productDetails?.model) {
      this.productDetails.model.forEach((model: any) => {
        const quantity = this.quantities[model._id] || 0;
        const price = this.getPriceForQuantity(model, quantity);
        model.subTotal = price * quantity;
      });
    }
  }

  getSubTotal() {
    let total = 0;
    if (this.productDetails) {
      this.productDetails?.model.forEach((model: any) => {
        total += model.subTotal || 0;
      });
    }
    return total.toFixed(2);
  }

  getGst() {
    const total = parseFloat(this.getSubTotal());
    const result = total * 18 / 100;
    return result.toFixed(2);
  }

  getFinalTotal() {
    const subtotal = parseFloat(this.getSubTotal());
    const gst = parseFloat(this.getGst());
    const result = subtotal + gst;
    return result.toFixed(2);
  }

  // Increment quantity for a model
  incrementQuantity(model: any) {
    const currentQty = this.quantities[model._id] || 0;
    this.quantities[model._id] = currentQty + 1;
    this.recalculateSubtotals();
  }

  // Decrement quantity for a model
  decrementQuantity(model: any) {
    const currentQty = this.quantities[model._id] || 0;
    if (currentQty > 0) {
      this.quantities[model._id] = currentQty - 1;
      this.recalculateSubtotals();
    }
  }

  // Handle manual quantity input change
  onQuantityChange(model: any, event: any) {
    let value = Number(event.target.value);
    if (isNaN(value) || value < 0) {
      value = 0;
    }
    this.quantities[model._id] = value;
    this.recalculateSubtotals();
  }

  async addToCart(): Promise<void> {

    if (!this.isUserLoggedIn) {
      this._dialog.open(LoginModalComponent, {
        ...{
          maxWidth: '700px'
        }
      })
    } else {
      // Validate minimum order quantity (MOQ) for each model
      for (const model of this.productDetails.model) {
        const quantity = this.quantities[model?._id] || 0;
        const firstMoqs = model?.moqs?.slice(0, 1);
        if (firstMoqs[0]?.min > quantity && quantity !== 0) {
          this._utilService.showErrorSnack(
            this._matSnackBar,
            `The min. order for this item is ${firstMoqs[0]?.min} pieces. Adjust quantity to continue.`
          );
          return; // Stop further execution if MOQ not met
        }
      }

      // Convert quantities object to model array for payload
      const modelArray = this._utilService.convertObjectToModelArray(this.quantities);
      let filteredModelArr = modelArray.filter((item: any) => item.quantity !== 0);
      for (const model of filteredModelArr) {
        const selectedVariant = this.selectedVariants[model.modelId];
        if (selectedVariant) {
          (model as any).variant = Object.entries(selectedVariant[0]).map(([variantName, variantValues]) => ({
            variantName: variantName,
            variantValue: Array.isArray(variantValues) ? variantValues : [variantValues]
          }));
        }
      }

      // Prepare payload for addToCart API
      const payload: AddToCart = {
        productId: this.productDetails.id,
        subTotal: this.getSubTotal(),
        gstTotal: this.getGst(),
        grandTotal: this.getFinalTotal(), // Fixed typo here
        model: filteredModelArr,
      };


      // return;
      try {
        await this._cartService.addToCart(payload);
        this._utilService.headerCount();
        this.sidenav.close();
        filteredModelArr = [];
        this.quantities = {};
        this._utilService.showSuccessSnack(this._matSnackBar, 'Added To Cart');
      } catch (error: any) {
        const errorMessage = error?.error?.message || 'Failed to add to cart. Please try again.';
        this._utilService.showErrorSnack(this._matSnackBar, errorMessage);
      }
    }

  }
}
