import { Component, OnInit } from '@angular/core';
import { CommonHelperService } from 'src/app/services/common-helper.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ValidationHelperService } from 'src/app/services/validation-helper.service';
import { CustomValidators } from 'src/app/shared/directives/custom-validator';
declare var $: any;
@Component({
    selector: 'app-manage-config',
    templateUrl: './manage-config.component.html',
    styleUrls: ['./manage-config.component.scss']
})
export class ManageConfigComponent implements OnInit {
    channelNameList = [];
    manageConfigForm: FormGroup;
    showComponent = false;
    editText = true;
    manageConfigList = [];
    errorMessage: any;
    responseMessage: string;
    requestChannelID: any;
    configChannel = {
        displayKey: "channelNameChannelId",
        search: true,
        height: 'auto',
        placeholder: 'Select Channel',
        customComparator: () => { },
        noResultsFound: 'No results found!',
        clearOnSelection: true,
        searchOnKey: 'channelName'
    };

    constructor(private commonHelper: CommonHelperService,
        private fb: FormBuilder,
        private validationService: ValidationHelperService,) { }

    ngOnInit() {

        this.manageConfigForm = this.fb.group({
            channelId: ['', Validators.required],
            manageConfigArray: this.fb.array([this.fb.control('', Validators.required)])
        })

        const sendToken = {
            token: localStorage.getItem('authToken'),
            channelId: localStorage.getItem('accessSelfChannelOnly') == 'YES' ? localStorage.getItem('channelId') : 'ALL'
        };

        if (localStorage.getItem('orgTypeCode') == 'SUPER_BO') {
            sendToken['isConfig'] = 'YES'
        }

        this.commonHelper.makeRequest(sendToken, 'getChannelList', false).subscribe(res => {
            if (res.statusCode == 0) {
                this.channelNameList = res.data
                this.channelNameList.forEach(channel => channel['channelNameChannelId'] = channel.channelName + ' (' + channel.channelId + ')')
                if (this.channelNameList.length == 1) {
                    this.manageConfigForm.patchValue({ channelId: this.channelNameList[0] });
                    this.manageConfigForm.get('channelId').disable({ emitEvent: false });
                }
            }
        });

        this.manageConfigForm.get('channelId').valueChanges.subscribe(data => {
            this.showComponent = false;

            let formArray = this.manageConfigForm.get('manageConfigArray') as FormArray;
            while (formArray.length !== 0) {
                formArray.removeAt(0)
            }
        })

    }
    initTransactionArray(data) {
        const control = <FormArray>this.manageConfigForm.controls['manageConfigArray'];
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
                channelId: this.manageConfigForm.get('channelId').value.channelId,
                channelApplicable: false,
                fetchCache: false
            }
            this.commonHelper.makeRequest(request, 'getConfigurations', true).subscribe(res => {
                if (res.statusCode == 0) {
                    this.showComponent = true;
                    this.manageConfigList = res.data.configuration;
                    this.requestChannelID = res.data.channelId;
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
        return (<FormArray>this.manageConfigForm.get('manageConfigArray')).controls[i].invalid;
    }

    onSave() {
        if (this.manageConfigForm.get('manageConfigArray').valid) {
            let request = { channelId: this.requestChannelID, configuration: [], token: localStorage.getItem('authToken') }
            let control = this.manageConfigForm.controls.manageConfigArray as FormArray;
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
                    this.manageConfigForm.patchValue({ channelId: '' });
                    this.manageConfigForm.get('channelId').enable({ emitEvent: false });
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