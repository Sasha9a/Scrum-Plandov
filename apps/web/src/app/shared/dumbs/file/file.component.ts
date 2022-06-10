import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { FileDto } from "@scrum/shared/dtos/file.dto";

@Component({
  selector: 'grace-file',
  templateUrl: './file.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileComponent {

  @Input() public file: FileDto;

  @Input() public canDelete = false;
  @Output() public delete = new EventEmitter();

}
