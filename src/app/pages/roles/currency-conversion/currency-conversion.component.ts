import { Component, OnInit } from "@angular/core";
import { UntypedFormArray, UntypedFormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
// import { CommonHelperService } from "../../../../services/common-helper.service";
import { NavigationEnd, Router } from "@angular/router";
import { CommonHelperService } from "../../../services/common-helper.service";

@Component({
  selector: "app-currency-conversion",
  templateUrl: "./currency-conversion.component.html",
  styleUrls: ["./currency-conversion.component.scss"],
})
export class CurrencyConversionComponent implements OnInit {
  errorMessage;
  responseMessage;
  currencyConversionForm: UntypedFormGroup;
  exchangeTypeList = [
    { key: "DEPOSIT", value: "DEPOSIT" },
    { key: "WITHDRAWAL", value: "WITHDRAWAL" },
    { key: "FUND_TRANSFER_OUT", value: "FUND TRANSFER OUT" },
    { key: "FUND_TRANSFER_IN", value: "FUND TRANSFER IN" },
  ];
  disableAdd: boolean = true;
  configChannel = {
    displayKey: "channelNameChannelId",
    search: true,
    height: "auto",
    placeholder: "Select Channel",
    customComparator: () => { },
    // noResultsFound: "No results found!",
    clearOnSelection: true,
    searchOnKey: "channelName",
  };
  configExchange = {
    displayKey: "value",
    search: true,
    height: "auto",
    placeholder: "Select Type",
    customComparator: () => { },
    noResultsFound: " ",
    clearOnSelection: true,
    searchOnKey: "value",
  };
  configSource = {
    displayKey: "value",
    search: true,
    height: "auto",
    placeholder: "Select Currency",
    noResultsFound: " ",
    clearOnSelection: true,
    searchOnKey: "value",
    limitTo: 1000,
  };
  configTarget = {
    displayKey: "value",
    search: true,
    height: "auto",
    placeholder: "--Select--",
    noResultsFound: " ",
    clearOnSelection: true,
    searchOnKey: "value",
    limitTo: 1000,
  };
  channelNameList: any;
  sourceCurrencyList = [];
  targetCurrencyList = [];
  targetArray: any = [];
  exchangeCurrencyList = [];
  conversionRateData = [];
  navigationSubscription: any;
  constructor(
    private fb: UntypedFormBuilder,
    private commonHelper: CommonHelperService,
    private router: Router
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this.currencyConversionForm = this.fb.group({
      channelId: ["", Validators.required],
      exchangeType: ["", Validators.required],
      sourceCurrency: ["", Validators.required],
      targetArray: this.fb.array([]),
    });

    const reqData = {
      token: localStorage.getItem("authToken"),
      channelId:
        localStorage.getItem("accessSelfChannelOnly") == "YES"
          ? localStorage.getItem("channelId")
          : "ALL",
    };
    this.commonHelper
      .makeRequest(reqData, "getChannelList", false)
      .subscribe((res) => {
        if (res.statusCode == 0) {
          this.channelNameList = res.data;
          this.channelNameList.forEach(
            (channel) =>
            (channel["channelNameChannelId"] =
              channel.channelName + " (" + channel.channelId + ")")
          );
          if (this.channelNameList.length == 1) {
            this.currencyConversionForm.patchValue({
              channelId: this.channelNameList[0],
            });
            this.currencyConversionForm
              .get("channelId")
              .disable({ emitEvent: false });
          }
        }
      });
    this.currencyConversionForm
      .get("channelId")
      .valueChanges.subscribe((channel) => {
        if (channel && channel.channelId) {
          this.sourceCurrencyList = channel.AVAILABLE_CURRENCIES.split(",");
          this.targetCurrencyList = channel.ALLOWED_CURRENCIES.split(",");
          this.targetCurrencyList.push(channel.CURRENCY_CODE);
          this.targetCurrencyList.push(channel.NATIVE_CURRENCY_CODE);
          this.targetCurrencyList = this.targetCurrencyList.filter(
            (el, i, a) => i === a.indexOf(el)
          );
        }
      });
    this.currencyConversionForm
      .get("sourceCurrency")
      .valueChanges.subscribe((value) => {
        if (value == undefined || value == null || value.length == 0) {
          this.targetArray = [];
          this.disableAdd = true;
        } else {
          this.disableAdd = false;
          this.exchangeCurrencyList[0] = value;
          let req = {
            channelId:
              this.currencyConversionForm.get("channelId").value.channelId,
            token: localStorage.getItem("authToken"),
            sourceCurrency:
              this.currencyConversionForm.get("sourceCurrency").value,
          };
          this.commonHelper
            .makeRequest(req, "getConversionRates", true)
            .subscribe((res) => {
              this.conversionRateData = [];
              if (res.statusCode == 0) {
                this.conversionRateData = res.data.conversionRates;
              }
            });
        }
      });

    this.currencyConversionForm
      .get("exchangeType")
      .valueChanges.subscribe((value) => {
        this.currencyConversionForm
          .get("sourceCurrency")
          .enable({ emitEvent: false });
      });
  }

  addTargetCurrency() {
    this.currencyConversionForm
      .get("sourceCurrency")
      .disable({ emitEvent: false });
    this.targetArray = this.currencyConversionForm.controls
      .targetArray as UntypedFormArray;
    this.targetArray.push(
      this.fb.group({
        currency: ["", Validators.required],
        exchangeCharges: ["", Validators.required],
        exchangeCurrency: ["", Validators.required],
        exchangeRate: ["", Validators.required],
      })
    );
  }

  onChangeTragetCurrency(event, control) {
    control.controls.exchangeCurrency.patchValue(event.value);
  }

  onSubmit() {
    if (this.currencyConversionForm.valid) {
      let reqData = {
        channelId: this.currencyConversionForm.get("channelId").value.channelId,
        exchangeType: this.currencyConversionForm.get("exchangeType").value.key,
        sourceCurrency: this.currencyConversionForm.get("sourceCurrency").value,
        conversions: this.currencyConversionForm.controls.targetArray.value,
        token: localStorage.getItem("authToken"),
      };
      this.commonHelper
        .makeRequest(reqData, "setConversionRates", true)
        .subscribe((res) => {
          if (res.statusCode == 0) {
            this.responseMessage = res.message;
            this.commonHelper.animateMessage.call(this, "containerWrap");
            this.reset();
          } else {
            this.errorMessage = res.message;
            this.commonHelper.animateMessage.call(this, "containerWrap");
          }
        });
    } else {
      this.commonHelper.validateAllFormFieldsIncludingFomrArray(
        this.currencyConversionForm
      );
    }
  }

  reset() {
    //this.disableAdd=true
    this.conversionRateData = [];
    this.currencyConversionForm
      .get("sourceCurrency")
      .enable({ emitEvent: false });
    this.targetArray = [];
    this.ngOnInit();
  }

  get f() {
    return this.currencyConversionForm.controls;
  }
  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}
