import { Component, OnInit } from '@angular/core';
// import { CommonHelperService } from '../../../../services/common-helper.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray } from '@angular/forms';
import { CommonHelperService } from '../../../services/common-helper.service';
import { ValidationHelperService } from '../../../services/validation-helper.service';
// import { ValidationHelperService } from 'src/app/services/validation-helper.service';
// import { CustomValidators } from 'src/app/shared/directives/custom-validator';
declare var $: any;
@Component({
    selector: 'app-manage-config',
    templateUrl: './manage-config.component.html',
    styleUrls: ['./manage-config.component.scss']
})
export class ManageConfigComponent implements OnInit {
    domainNameList = [];
    manageConfigForm: UntypedFormGroup;
    showComponent = false;
    editText = true;
    manageConfigList = [];
    errorMessage: any;
    responseMessage: string;
    requestDomainID: any;
    configDomain = {
        displayKey: "domainNameDomainId",
        search:true, 
        height: 'auto', 
        placeholder:'Select Domain',              
        customComparator: ()=>{},
        noResultsFound: 'No results found!',
        clearOnSelection: true,
        searchOnKey: 'domainName'
      };

    constructor(private commonHelper: CommonHelperService,
        private fb: UntypedFormBuilder,
        private validationService: ValidationHelperService, ) { }

    ngOnInit() {

        this.manageConfigForm = this.fb.group({
            domainId: ['', Validators.required],
            manageConfigArray: this.fb.array([this.fb.control('', Validators.required)])
        })

        const sendToken = {
            token: localStorage.getItem('authToken'),
            domainId: localStorage.getItem('accessSelfDomainOnly') == 'YES' ? localStorage.getItem('domainId') : 'ALL'
        };

        if(localStorage.getItem('orgTypeCode') == 'SUPER_BO'){
            sendToken['isConfig'] = 'YES'
        }

        this.commonHelper.makeRequest(sendToken, 'getDomainList', false).subscribe(res => {
            if (res.statusCode == 0) {
                this.domainNameList = res.data
                this.domainNameList.forEach(domain => domain['domainNameDomainId'] = domain.domainName + ' (' + domain.domainId + ')')
                if (this.domainNameList.length == 1) {
                    this.manageConfigForm.patchValue({ domainId: this.domainNameList[0] });
                    this.manageConfigForm.get('domainId').disable({ emitEvent: false });
                  }
            }
        });

        this.manageConfigForm.get('domainId').valueChanges.subscribe(data => {
            this.showComponent = false;

            let formArray = this.manageConfigForm.get('manageConfigArray') as UntypedFormArray;
            while (formArray.length !== 0) {
                formArray.removeAt(0)
            }
        })

    }
    initTransactionArray(data) {
        const control = <UntypedFormArray>this.manageConfigForm.controls['manageConfigArray'];
        control.controls = [];
        data.map((data, k) => {
            control.push(this.initAppArray(data));
        });
    }

    initAppArray(data) {
        const form = this.fb.group({
            checkField: [false],
            displayName: [data.displayName],
            configCode: [data.configCode],
            configValue: [{ value: data.configValue, disabled: true }, Validators.required]
        })
        return form;
    }

    get f() { return this.manageConfigForm.controls; }

    onSearch() {

        if (this.manageConfigForm.valid) {

            let request = {
                token: localStorage.getItem('authToken'),
                domainId: this.manageConfigForm.get('domainId').value.domainId,
                domainApplicable:false,
                fetchCache:false
            }
            this.commonHelper.makeRequest(request, 'getConfigurations', true).subscribe(res => {
                if (res.statusCode == 0) {
                    this.showComponent = true;
                    this.manageConfigList = res.data.configuration;
                    this.requestDomainID = res.data.domainId;
                    this.initTransactionArray(this.manageConfigList);

                } else {
                    this.errorMessage = res.message;
                }
                this.commonHelper.animateMessage.call(this, 'containerWrap')
            })
        } else {
            this.validationService.validateAllFormFields(this.manageConfigForm);
        }

    }
    onCheck(details) {
        if (details.controls.checkField.value) {
            details.controls.configValue.enable()
        } else {
            details.controls.configValue.disable()
        }
    }

    getFormArrayValidity(i) {
        return (<UntypedFormArray>this.manageConfigForm.get('manageConfigArray')).controls[i].invalid;
    }

    onSave() {
        if(this.manageConfigForm.get('manageConfigArray').valid) {
            let request = { domainId: this.requestDomainID, configuration: [], token: localStorage.getItem('authToken') }
            let control = this.manageConfigForm.controls.manageConfigArray as UntypedFormArray;
            for (let i = 0; i < control.length; i++) {
                if (control.controls[i].get('checkField').value == true) {
                    request.configuration.push({
                        configCode: control.controls[i].get('configCode').value,
                        configValue: control.controls[i].get('configValue').value
                    })
                }
            }

            this.commonHelper.makeRequest(request, 'updateConfigurations', true).subscribe(res => {
                if (res.statusCode == 0) {
                    request.configuration.forEach(function (d) {
                        if (d.configCode == "ALLOWED_DECIMAL_SIZE") {
                            localStorage.setItem("allowedDecimalDigits", d.configValue);
                        }
                    })
                    this.manageConfigForm.patchValue({ domainId: '' });
                    this.manageConfigForm.get('domainId').enable({ emitEvent: false });
                    this.ngOnInit();
                    this.responseMessage = res.message;
                    this.showComponent = false;
                } else {
                    this.errorMessage = res.message;
                }
                this.commonHelper.animateMessage.call(this, 'containerWrap')
            })
        }
    }
}