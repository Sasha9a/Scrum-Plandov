import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: 'grace-common-layout',
  templateUrl: './common-layout.component.html',
  styleUrls: ['./common-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonLayoutComponent implements OnInit {
  public constructor() {}

  public ngOnInit(): void {}
}
