import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { FileUploaderModule } from "@scrum/web/shared/dumbs/file-uploader/file-uploader.module";
import { ApiUrlPipeModule } from "@scrum/web/shared/pipes/api-url/api-url-pipe.module";
import { JoinPipeModule } from "@scrum/web/shared/pipes/join/join-pipe.module";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { SkeletonModule } from "primeng/skeleton";
import { UserEditFormComponent } from './user-edit-form.component';

@NgModule({
  declarations: [UserEditFormComponent],
  exports: [UserEditFormComponent],
  imports: [CommonModule, ButtonModule, InputTextModule, FormsModule, JoinPipeModule, ApiUrlPipeModule, SkeletonModule, FileUploaderModule]
})
export class UserEditFormModule {}
