declare var $: any;
import { Component, OnInit, AfterViewInit } from "@angular/core";
import { CommonHelperService } from "../../../../common-helper.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, NavigationEnd } from "@angular/router";
import { Observable } from "rxjs";
import { Car } from "../../table/resources/car";
import { map, tap } from "rxjs/operators";
import { DeserializeArray } from "cerializr";
import { HttpClient } from "@angular/common/http";

import {
  NbSortDirection,
  NbSortRequest,
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
} from "@nebular/theme";

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  domainName: string;
  userName: string;
  name: string;
  emailId: string;
  mobileNumber: number;
  userStatus: string;
}

@Component({
  selector: "ngx-form-layouts",
  styleUrls: ["./form-layouts.component.scss"],
  templateUrl: "./form-layouts.component.html",
})
export class FormLayoutsComponent {
  dataSource: NbTreeGridDataSource<FSEntry>;
  cars$: Observable<Car[]>;
  displayCols = ["id"];
  headCols = ["ID"];
  allColumns = [
    "domainName",
    "userName",
    "name",
    "emailId",
    "mobileNumber",
    "userStatus",
  ];
  headCol = [
    "Domain Name",
    "User Name",
    "name",
    "Email ID",
    "Mobile Number",
    "Status",
  ];
  columns = [
    { key: "domainName", value: "Domain Name" },
    { key: "userName", value: "Domain Name" },
    { key: "name", value: "Domain Name" },
    { key: "emailId", value: "Email ID" },
    { key: "mobNum", value: "Mobile Number" },
    { key: "status", value: "Status" },
  ];
  searchUserForm: FormGroup;
  private dataa: TreeNode<FSEntry>[] = [];
  orgTypeList = [];
  roleList = [];
  showTable = false;
  showComponent = true;
  userId: number;
  userData: any;
  showView = false;
  searchUserList: any;
  data: any;
  showViewButton;
  searchPermissions;
  roleId: number;
  responseMessage: any;
  errorMessage: any;
  navigationSubscription: any;
  mobileNoRegex = "";
  countryCodes = [];
  searchForm: FormGroup;
  countryStateCityForm: FormGroup;
  searchQuery = "";
  mobileMinMaxLength;
  mobileMaxLengthMob;
  mobileMinLengthMob;
  domainList = [];
  orgList = [];
  defaultDateFormat = localStorage.getItem("defaultDateFormat");
  request = {
    token: "oMLJCEeSuffTamjTaDUNq+T0+pu82TGHt3e8cS4x+VDJ5mtiTwYPeRJh5Z6DpklA",
    domainId: "ALL",
  };

  statusList = [
    {
      key: this.commonHelper.getCustomMessages("active"),
      value: "ACTIVE",
    },
    {
      key: this.commonHelper.getCustomMessages("INACTIVE"),
      value: "INACTIVE",
    },
    {
      key: this.commonHelper.getCustomMessages("terminate"),
      value: "TERMINATE",
    },
  ];
  private tada: TreeNode<FSEntry>[];
  configDomain = {
    displayKey: "domainNameDomainId",
    search: true,
    height: "auto",
    placeholder: "Select Domain",
    customComparator: () => {},
    noResultsFound: "No results found!",
    clearOnSelection: true,
    searchOnKey: "domainName",
  };

  constructor(
    private http: HttpClient,
    private commonHelper: CommonHelperService,
    private fb: FormBuilder,
    private router: Router,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>
  ) {
    this.countryStateCityForm = this.fb.group({});
    // this.searchPermissions =
    // this.commonHelper.returnPagePermission("USER_SEARCH");
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        if (this.searchUserForm) {
          this.showComponent = true;
          this.showView = false;
          this.resetPage();
        }
      }
    });
    this.commonHelper.getMOBILE_CODE_MIN_MAX_LENGTH.subscribe(
      (mobileCodeMinMax) => {
        this.mobileMinMaxLength = mobileCodeMinMax;
      }
    );
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
  ngOnInit() {
    this.cars$ = this.http.get("/assets/car.json").pipe(
      map((res: any) => DeserializeArray(res, Car)),
      tap((res) => console.log(res))
    );
    this.searchUserForm = this.fb.group({
      roleId: [""],
      firstName: [""],
      lastName: [""],
      emailId: [""],
      mobileNo: [""],
      userName: [""],
      userId: [""],
      countryCodeForMobileNo: [""],
      country: [""],
      state: [""],
      city: [""],
      isFinanceHead: [""],
      isHead: [""],
      status: [this.statusList[0].value],
      domainId: [""],
    });

    this.getDomainList(this.request, (err, data) => {
      this.domainList = data;
      this.domainList.forEach(
        (domain) =>
          (domain["domainNameDomainId"] =
            domain.domainName + " (" + domain.domainId + ")")
      );
      if (this.domainList.length == 1) {
        this.searchUserForm.patchValue({ domainId: this.domainList[0] });
        this.searchUserForm.controls.domainId.disable({ emitEvent: false });
      }
    });

    this.searchUserForm
      .get("countryCodeForMobileNo")
      .valueChanges.subscribe((mobileCode) => {
        let mobileData = this.mobileMinMaxLength.filter(
          (data) => Object.keys(data) == mobileCode
        );
        this.mobileMaxLengthMob = mobileData[0]
          ? mobileData[0][Object.keys(mobileData[0])[0]].max || "8"
          : "10";
        this.mobileMinLengthMob = mobileData[0]
          ? mobileData[0][Object.keys(mobileData[0])[0]].min || "10"
          : "7";
      });

    const data = {
      token: "oMLJCEeSuffTamjTaDUNq+T0+pu82TGHt3e8cS4x+VDJ5mtiTwYPeRJh5Z6DpklA",
    };
    this.commonHelper
      .makeRequest(data, "getRoleList", false)
      .subscribe((res) => {
        if (res.statusCode == 0) {
          this.roleList = res.data;
        }
      });
    this.searchUserForm.get("domainId").valueChanges.subscribe((domain) => {
      if (domain && domain.COUNTRY_CODES) {
        this.countryCodes = domain.COUNTRY_CODES.split(",");
        this.searchUserForm.patchValue(
          { countryCodeForMobileNo: this.countryCodes[0] },
          { emitEvent: false }
        );
      }
    });

    this.searchForm = this.fb.group({
      searchField: [""],
    });
  }

  get countryStateCityFormControl() {
    return <FormGroup>this.countryStateCityForm.get("countryStateCityForm");
  }

  ngAfterViewInit(): void {
    this.searchForm.get("searchField").valueChanges.subscribe((res) => {
      this.searchQuery = res;
    });
  }
  onSearch() {
    console.log(this.dataSource);
    if (this.searchUserForm.valid) {
      let searchData = {
        request: {},
        token:
          "oMLJCEeSuffTamjTaDUNq+T0+pu82TGHt3e8cS4x+VDJ5mtiTwYPeRJh5Z6DpklA",
      };
      let formData = {
        emailId: this.searchUserForm.get("emailId").value || undefined,
        mobileCode: this.searchUserForm.get("mobileNo").value
          ? this.searchUserForm.get("countryCodeForMobileNo").value
          : "" || undefined,
        mobileNumber: this.searchUserForm.get("mobileNo").value
          ? this.searchUserForm.get("mobileNo").value
          : "" || undefined,
        userId: this.searchUserForm.get("userId").value || undefined,
        userName: this.searchUserForm.get("userName").value || undefined,
        city: this.countryStateCityFormControl?.get("city")?.value ?? undefined,
        country:
          this.countryStateCityFormControl?.get("country")?.value ?? undefined,
        firstName: this.searchUserForm.get("firstName").value || undefined,
        isHead: this.searchUserForm.get("isHead").value || undefined,
        lastName: this.searchUserForm.get("lastName").value || undefined,
        roleId: this.searchUserForm.get("roleId").value.roleId || undefined,
        state:
          this.countryStateCityFormControl?.get("state")?.value ?? undefined,
        status: this.searchUserForm.get("status").value || undefined,
        domainId: 1,
      };

      for (let key in formData) {
        if (formData[key]) {
          searchData.request[key] = formData[key];
        }
      }

      this.commonHelper
        .makeRequest(searchData, "doUserSearch", true)
        .subscribe((res) => {
          this.data = [];
          if (res.statusCode == 0) {
            console.log(res.data);
            this.data = res.data;
            this.tada = res.data;
            this.dataSource = this.dataSourceBuilder.create(
              this.tada.map((x) => {
                return { data: x };
              })
            );
            console.log(this.dataSource);
            this.showTable = true;
            // this.commonHelper.animateMessage.call(this, "result");
          } else {
            this.errorMessage = res.message;
            this.showTable = false;
            // this.commonHelper.animateMessage.call(this, "containerWrap");
          }
        });
    }
    // this.validationService.validateAllFormFields(this.searchUserForm);
  }

  resetPage() {
    Object.assign(this, {
      showTable: false,
      mobileNoRegex: "",
      searchQuery: "",
    });
    this.countryCodes = [];
    this.ngOnInit();
    this.searchUserForm.patchValue({
      countryCodeForMobileNo: this.countryCodes[0],
    });
    Object.keys(this.countryStateCityFormControl.controls).forEach((key) => {
      this.countryStateCityFormControl.get(key).patchValue("");
    });
    this.commonHelper.animateMessage.call(this, "form");
    let accords = document.querySelectorAll(".accordion");
    for (var i = 0; i < accords.length; i++) {
      if ((<HTMLElement>accords[i].nextElementSibling).style.maxHeight)
        (<HTMLElement>accords[i]).click();
    }
  }
  getDomainList(requestData, callback): void {
    let domainList = [];
    this.commonHelper
      .makeRequest(requestData, "getDomainList", false)
      .subscribe((res) => {
        if (res.statusCode == 0) {
          if (res.data instanceof Array) {
            for (let i = 0; i < res.data.length; i++) {
              domainList.push(res.data[i]);
            }
          } else {
            domainList.push(res.data);
          }
          callback(null, domainList);
        } else {
          this.errorMessage = res.message;
          // this.commonHelper.animateMessage.call(this, "containerWrap");
          callback(null, []);
        }
      });
  }
  showPage(event) {
    if (event) {
      Object.assign(this, {
        showView: false,
        showComponent: true,
        showTable: true,
      });
    }
  }

  onEditPage(userid) {
    Object.assign(this, {
      userId: userid,
      showTable: false,
      showComponent: false,
      showView: true,
    });
  }

  // checkPermission(permissionString: string): boolean {
  //   return this.searchPermissions.indexOf(permissionString) > -1 ? true : false;
  // }

  get f() {
    return this.searchUserForm.controls;
  }
}
