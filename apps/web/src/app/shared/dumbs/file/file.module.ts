import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiUrlPipeModule } from "@scrum/web/shared/pipes/api-url/api-url-pipe.module";
import { FileTypePipeModule } from "@scrum/web/shared/pipes/file-type/file-type-pipe.module";
import { ImageModule } from "primeng/image";
import { FileComponent } from './file.component';

@NgModule({
  declarations: [FileComponent],
  exports: [FileComponent],
  imports: [CommonModule, ImageModule, ApiUrlPipeModule, FileTypePipeModule]
})
export class FileModule {}
