import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output, SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { CrmTableColumn } from "@scrum/web/core/models/crm-table-column";
import { DomHandler } from "primeng/dom";
import { Table, TableService } from "primeng/table";
import { ObjectUtils } from "primeng/utils";

@Component({
  selector: 'grace-table[name]',
  templateUrl: './table.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DomHandler,
    ObjectUtils,
    TableService,
    {
      provide: Table,
      useFactory: (crmTable: TableComponent) => crmTable.table,
      deps: [TableComponent]
    }
  ]
})
export class TableComponent implements OnInit, OnChanges {

  @ViewChild('table', { static: true }) private table: Table;

  @ContentChild('headerTemplate') public headerTemplate: any;
  @ContentChild('groupheaderTemplate') public groupheaderTemplate: any;
  @ContentChild('rowTemplate') public rowTemplate: any;
  @ContentChild('footerTemplate') public footerTemplate: any;
  @ContentChild('captionTemplate') public captionTemplate: any;

  @Input() public loading = false;
  @Input() public paginationLoading = false;

  @Input() public selectable = false;
  @Input() public selectionDisabled = false;
  @Input() public selectedItems: any[] = [];
  @Output() public selectedItemsChange = new EventEmitter<any[]>();

  @Input() public name: string;
  @Input() public values: any[] = [];
  @Input() public columns: CrmTableColumn[] = [];
  public selectedColumns: CrmTableColumn[] = [];
  public selectedColumnsMap: Record<string, boolean>;

  @Input() public filterColumns = false;

  @Input() public sort = '';
  @Output() public sortChange = new EventEmitter<string>();

  @Input() public inplaceSort = true;
  @Input() public styleClass = '';
  @Input() public scrollHeight: string;
  @Input() public responsiveLayout: string;

  @Input() public groupRowsBy: string;
  @Input() public rowGroupMode: string;

  @Input() public reorderableColumns: boolean;
  @Output() public rowReorder = new EventEmitter<{ dragIndex: number, dropIndex: number }>();

  @Input() public autoLayout = false;

  public skeletonItems = Array(15).fill(null);

  public ngOnInit(): void {
    if (!this.sort) {
      this.sort = localStorage.getItem(`table.${this.name}.sort`)
        ?? this.columns.find(column => column.sort && column.defaultSort)?.sort
        ?? this.columns.find(column => column.sort)?.sort
        ?? '';
    }

    const selectedColumnsNames = localStorage.getItem(`table.${this.name}.columns`);
    if (selectedColumnsNames) {
      this.selectedColumns = this.columns.filter((col) => selectedColumnsNames.includes(col.name as string));
    } else {
      this.selectedColumns = [...this.columns];
    }

    this.updateSelectedColumnsMap();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.columns?.currentValue) {
      this.columns.forEach((element, index) => {
        if (!element.order) {
          element.order = index;
        }
      });
    }
  }

  public getSortIconClass(sort: string): string {
    return this.sort.includes(sort)
      ? this.sort[0] === '-' ? 'pi pi-sort-down' : 'pi pi-sort-up'
      : 'pi pi-sort';
  }

  public setSort(sort: string): void {
    this.sort = this.sort === sort
      ? sort[0] === '-' ? sort.substring(1) : `-${sort}`
      : sort;
    localStorage.setItem(`table.${this.name}.sort`, this.sort);
    if (this.groupRowsBy) {
      this.values = [...this.values];
    }

    this.sortChange.emit(this.sort);
  }

  public updateSelectedColumnsMap() {
    this.selectedColumnsMap = {};
    this.selectedColumns.forEach((col) => this.selectedColumnsMap[col.name as string] = true);
  }

  public setFilterColumns(selectedColumns: CrmTableColumn[]) {
    this.updateSelectedColumnsMap();
    localStorage.setItem(`table.${this.name}.columns`, JSON.stringify(selectedColumns.map(col => col.name)));
  }

}
