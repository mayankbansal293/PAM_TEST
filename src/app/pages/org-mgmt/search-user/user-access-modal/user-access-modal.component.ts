import { Component, OnInit, Input  } from '@angular/core';
import { FormBuilder,FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-user-access-modal',
  templateUrl: './user-access-modal.component.html',
  styleUrls: ['./user-access-modal.component.scss']
})
export class UserAccessModalComponent implements OnInit {
 modalForm:FormGroup;
 data;//comes from view-user-component 
 stopUpdate:any;
  showTimeError: boolean;
  constructor(
    // public modal: NgbActiveModal,
    private fb:FormBuilder) { }

 
  ngOnInit() {

    let oldDate= this.data ? this.data.split("-") : ["", ""];
 
    this.modalForm = this.fb.group({
         startdate:[oldDate[0],Validators.required],
         enddate:[oldDate[1],Validators.required]
    })

    if(this.modalForm.get('enddate').value == " "){
        this.stopUpdate=true;
    }
  }

 showTime(){
  this.showTimeError=false;
 }


  close(){
    // this.modal.close(this.data);
  }

  update(){
   if(this.checkTime()){
      let updatedDate= this.modalForm.get('startdate').value+'-'+this.modalForm.get('enddate').value
      // if( this.modalForm.get('startdate').value &&  this.modalForm.get('enddate').value)
      // this.modal.close(updatedDate);
   }else{
     this.showTimeError=true;
   }
  }

   checkTime(){
      if(this.modalForm.get('startdate').value && this.modalForm.get('enddate').value){
        let splitStartDate=this.modalForm.get('startdate').value.split(":")
        let splitEndDate=this.modalForm.get('enddate').value.split(":")
        if(splitStartDate[0] > splitEndDate[0]){
          this.stopUpdate=false;
        }else if(splitStartDate[0] == splitEndDate[0]){
            if(parseInt(splitStartDate[1]) >= parseInt(splitEndDate[1])){ 
              this.stopUpdate=false;
            }else{
              this.stopUpdate=true;
            }
        }else{
          this.stopUpdate=true;
        }
        
        return this.stopUpdate;
    }
  }

  get f() { return this.modalForm.controls; }
  
}
