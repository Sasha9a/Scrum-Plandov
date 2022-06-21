import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BoardDto } from "@scrum/shared/dtos/board/board.dto";
import { SprintFormDto } from "@scrum/shared/dtos/sprint/sprint.form.dto";
import { BaseFormComponent } from "@scrum/web/shared/dumbs/base-form/base-form.component";

@Component({
  selector: 'grace-sprint-form',
  templateUrl: './sprint-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SprintFormComponent extends BaseFormComponent<SprintFormDto> {

  @Input() public sprint = new SprintFormDto();
  public dto = SprintFormDto;

  @Input() public board: BoardDto;

  public override onSave(entity: SprintFormDto) {
    entity.board = this.board;
    super.onSave(entity);
  }

}
