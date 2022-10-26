import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FileDto } from '@scrum/shared/dtos/file.dto';
import { FileService } from '@scrum/web/core/services/file.service';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'scrum-file-uploader',
  templateUrl: './file-uploader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileUploaderComponent {
  @Input() public label = 'Файлы';
  @Input() public multiple = false;
  @Input() public icon = 'pi-paperclip';
  @Input() public accept = '';
  @Input() public maxFileSize = null;

  @ViewChild('fileUpload') public fileUpload: FileUpload;

  @Output() public filesUploaded = new EventEmitter<FileDto[]>();

  public uploadingFiles = false;

  public constructor(private readonly fileService: FileService, private readonly cdRef: ChangeDetectorRef) {}

  public uploadFiles(files: FileList) {
    this.uploadingFiles = true;
    this.fileService.upload(files).subscribe({
      next: (uploadedFiles) => {
        this.uploadingFiles = false;
        this.filesUploaded.emit(uploadedFiles);
        this.fileUpload.clear();
        this.cdRef.markForCheck();
      },
      error: () => {
        this.uploadingFiles = false;
        this.fileUpload.clear();
      }
    });
  }
}
