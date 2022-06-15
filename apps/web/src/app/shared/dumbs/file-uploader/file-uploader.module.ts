import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from "primeng/fileupload";
import { FileUploaderComponent } from './file-uploader.component';

@NgModule({
  declarations: [FileUploaderComponent],
  exports: [FileUploaderComponent],
  imports: [CommonModule, FileUploadModule]
})
export class FileUploaderModule {}
