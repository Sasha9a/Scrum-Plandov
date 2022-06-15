import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderModule } from "@scrum/web/shared/dumbs/file-uploader/file-uploader.module";
import { ApiUrlPipeModule } from "@scrum/web/shared/pipes/api-url/api-url-pipe.module";
import {SkeletonModule} from "primeng/skeleton";
import { TableModule } from "primeng/table";
import { UserInfoComponent } from './user-info.component';

@NgModule({
  declarations: [UserInfoComponent],
  exports: [UserInfoComponent],
  imports: [CommonModule, SkeletonModule, ApiUrlPipeModule, FileUploaderModule, TableModule]
})
export class UserInfoModule {}
