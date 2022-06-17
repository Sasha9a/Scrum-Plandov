import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BoardFormDto } from "@scrum/shared/dtos/board/board.form.dto";
import { ColumnBoardFormDto } from "@scrum/shared/dtos/board/column.board.form.dto";
import { UserDto } from "@scrum/shared/dtos/user/user.dto";
import { CrmTableColumn } from "@scrum/web/core/models/crm-table-column";
import { BaseFormComponent } from "@scrum/web/shared/dumbs/base-form/base-form.component";

@Component({
  selector: 'grace-board-form',
  templateUrl: './board-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardFormComponent extends BaseFormComponent<BoardFormDto> {

  @Input() public board = new BoardFormDto();
  public dto = BoardFormDto;

  @Input() public users: UserDto[] = [];

  @Output() public searchUser = new EventEmitter<string>();

  public columns: CrmTableColumn[] = [
    { class: 'w-3rem' },
    { label: 'Название' },
    { label: 'Цвет' },
    { class: 'w-6rem' }
  ];

  public addColumn() {
    if (!this.board.columns) {
      this.board.columns = [];
    }
    const column = new ColumnBoardFormDto();
    column.order = this.board.columns.length;
    this.board.columns.push(new ColumnBoardFormDto());
    this.board.columns = [...this.board.columns];
  }

  public deleteColumn(column: ColumnBoardFormDto) {
    this.board.columns = this.board.columns.filter((_column) => _column !== column);
  }

  public rowReorder(event: { dragIndex: number, dropIndex: number }) {
    if (event.dragIndex === event.dropIndex) {
      return;
    }
    this.board.columns.forEach((c, index) => c.order = index);
  }

  public toColumn(column: any): ColumnBoardFormDto {
    return column as ColumnBoardFormDto;
  }

}
