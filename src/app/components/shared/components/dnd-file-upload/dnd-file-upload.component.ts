import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-dnd-file-upload',
    templateUrl: './dnd-file-upload.component.html',
    styleUrls: ['./dnd-file-upload.component.scss']
})
export class DndFileUploadComponent implements OnChanges {

    @Input() error: any;
    @Input() fileInput;
    @Input() data: any;
    @Output() onchange = new EventEmitter<any>();

    files: any[] = [];

    isFileUploadError: boolean = true;

    constructor(
        private _snackBar: MatSnackBar
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        // console.log(this.data);
        if (changes['data'] && changes['data'].currentValue) {
            this.files = [{ url: `data:${this.data.type};base64,${this.data.data}` }];
        }
    }

    /**
     * on file drop handler
     */
    onFileDropped($event) {
        this.prepareFilesList($event);
    }

    /**
     * handle file from browsing
     */
    fileBrowseHandler(target:any) {
        this.prepareFilesList(target.files);
    }

    /**
     * Delete file from files list
     * @param index (File index)
     */
    deleteFile(index: number) {
        this.files.splice(index, 1);
        this.onchange.emit(this.files);
    }

    /**
     * Simulate the upload process
     */
    uploadFilesSimulator(index: number) {
        setTimeout(() => {
            if (index === this.files.length) {
                return;
            } else {
                const progressInterval = setInterval(() => {
                    if (this.files.length > 0) {
                        if (this.files[index].progress === 100) {
                            clearInterval(progressInterval);
                            this.uploadFilesSimulator(index + 1);
                        } else {
                            this.files[index].progress += 5;
                        }
                    } else {
                        if (progressInterval) {
                            clearInterval(progressInterval);
                        }
                    }
                }, 200);
            }
        }, 1000);
    }

    /**
     * Convert Files list to normal array list
     * @param files (Files List)
     */
    prepareFilesList(files: Array<any>) {
        if (this.fileInput.type && !files[0].type.includes(this.fileInput.type)) {
            this._snackBar.open(`Please select ${this.fileInput.type} file`, '', {
                duration: 5000,
                panelClass: ['ef-danger-snackbar'],
                horizontalPosition: 'center',
                verticalPosition: 'top',
            });
            return;
        }

        this.files = [];
        for (const item of files) {
            item.progress = 0;
            this.files.push(item);
        }
        // console.log(this.files);
        this.uploadFilesSimulator(0);
        this.onchange.emit(this.files);
    }

    /**
     * format bytes
     * @param bytes (File size in bytes)
     * @param decimals (Decimals point)
     */
    formatBytes(bytes, decimals) {
        if (bytes === 0) {
            return '0 Bytes';
        }
        const k = 1024;
        const dm = decimals <= 0 ? 0 : decimals || 2;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    _handleReaderLoaded(readerEvt) {
        const binaryString = readerEvt.target.result;
        console.log(btoa(binaryString));
        return btoa(binaryString);
    }

    doReset() {
        this.files = [];
    }
}
