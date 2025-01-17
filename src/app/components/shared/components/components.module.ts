import { NgModule } from '@angular/core';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { LoaderContainerComponent } from './loader-container/loader-container.component';
import { DataTableComponent } from './data-table/data-table.component'
import { SharedModule } from '../shared.module';
import { DndFileUploadComponent } from './dnd-file-upload/dnd-file-upload.component';
import { FileUploadProgressComponent } from './file-upload-progress/file-upload-progress.component';
import { ContentPanelComponent } from './content-panel/content-panel.component';
import { EfDrawerComponent } from './ef-drawer/ef-drawer.component';
import { ToastsContainerComponent } from './toasts-container/toasts-container.component';


@NgModule({
  declarations: [
    FileUploadComponent,
    BreadcrumbComponent,
    LoaderContainerComponent,
    DataTableComponent,
    DndFileUploadComponent,
    FileUploadProgressComponent,
    ContentPanelComponent,
    EfDrawerComponent,
    ToastsContainerComponent
  ],
  imports: [SharedModule],
  exports: [
    FileUploadComponent,
    BreadcrumbComponent,
    LoaderContainerComponent,
    DataTableComponent,
    DndFileUploadComponent,
    FileUploadProgressComponent,
    ContentPanelComponent,
    EfDrawerComponent,
    ToastsContainerComponent
  ],
})
export class ComponentsModule { }
