import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject, merge, repeat, takeUntil, timer } from 'rxjs';
import { ToastService } from '../../shared/components/toasts-container/toast.service';
import { GlobalSpinnerService } from '../../global-spinner/global-spinner.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-upload-employee',
  templateUrl: './upload-employee.component.html',
  styleUrl: './upload-employee.component.scss'
})
export class UploadEmployeeComponent {
  private destroyed$ = new Subject<void>();
  fileInput: any = { type: 'spreadsheet', accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" };
    fileList: any;
    isBulkUpload: boolean = false;
    bulkUploadData: any;
  @Input() isOpen: boolean = false;
  @Output() onCloseDrawer = new EventEmitter();
  constructor(
    public empService:EmployeeService,
    public toastService:ToastService,
    public spinner: GlobalSpinnerService,
) { }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
 }

  doCloseDrawer(state: string = '') {
      this.isOpen = false;
      this.onCloseDrawer.emit(state);
  }
  onChangeFileContent(content: any) {
    console.log(content);
    this.fileList = content;
    this.uploadBulk();
}

uploadBulk() {

    if (!this.fileList[0].type.includes('spreadsheet')) {
        this.toastService.show('Please select a Spreadsheet/Excel file', { classname: 'toast-error', delay: 4000 });
        return;
    }
    else {
        this.doUploadFnc();
    }
}

doUploadFnc() {
    if (this.fileList.length > 0) {
        const formData = new FormData();
        formData.append("file", this.fileList[0]);
        this.empBulUpload(formData);
    }
}

empBulUpload(formData: any) {    
    // this.empService.empBulUpload(formData)
    //     .pipe(takeUntil(this.destroyed$))
    //     .subscribe(
    //         {
    //             next:(res: any) => {
    //                 if (res.bulkUploadId) {
    //                     this.spinner.isLoading.next(true);
    //                     this.fileList = "";
    //                     setTimeout(() => {
    //                         this.spinner.isLoading.next(false);
    //                         this.getUploadedTemplateStatus(res.bulkUploadId);
    //                     }, 1000);
    //                 }
    //             },
    //             error:err=>{
    //                 this.toastService.show('Student Bulk Upload Failed', { classname: 'toast-error', delay: 4000 });
    //             }
    //         }
    //     );
}

getUploadedTemplateStatus(id) {
    let sub$: any;
    // sub$ = merge(
    //     this.empService.getTemplateRequests(id), timer(3000)
    // )
    //     .pipe(
    //         repeat()
    //     )
    //     .subscribe(
    //        {
    //         next: (res: any) => {
                
    //             if( res?.status === 'COMPLETED'){
    //                 sub$.unsubscribe();
    //                 this.bulkUploadData = res;
    //                 this.isShowMsg = true;
    //                 this.isBulkUpload = true;
    //             }
    //             else if(res?.status === 'FAILED'){
    //                 sub$.unsubscribe();
    //                 this.isShowMsg = false;
    //                 this.isBulkUpload = false;
    //                 this.toastService.show('Student Bulk Upload Failed', { classname: 'toast-error', delay: 4000 });
    //             }
    //         },
    //         error:(err:any)=>{
    //             sub$.unsubscribe();
    //             this.isShowMsg = false;
    //             this.isBulkUpload = false;
    //             this.toastService.show('Student Bulk Upload Failed', { classname: 'toast-error', delay: 4000 }); 
    //         }
    //        }
    // );
}
downloadSampleList(){
    // this.empService.downloadSample()
    //   .subscribe({
    //         next: (data: any) => {
    //         const blob = new Blob([data.body], { type: 'application/octet-stream' });
    //         const url = window.URL.createObjectURL(blob);
    //         console.log('fdata.body url ', url);
    //         const link = document.createElement('a');
    //         link.href = url; 
    //         link.download ='b2b_student_bulkupd_template.xlsx';
    //         link.click();
    //         window.URL.revokeObjectURL(url);
    //         //  this.router.navigateByUrl(`http://ac875750291f44ed08afbbace93f5a7d-36990a83063b1bb4.elb.ap-south-1.amazonaws.com/${data.filePath}`);
    //       },
    //       error: (error: any) => {
    //         this.toastService.show('Download Failed', { classname: 'toast-error', delay: 4000 });
    //       }
    //    }
    //   );
}
}
