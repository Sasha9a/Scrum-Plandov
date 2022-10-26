import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import moment from 'moment-timezone';

@Component({
  selector: 'scrum-footer-layout',
  templateUrl: './footer-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterLayoutComponent implements OnInit {
  public footerYear: string;

  public ngOnInit(): void {
    if (moment().year() === 2022) {
      this.footerYear = '2022';
    } else {
      this.footerYear = `2022-${moment().year()}`;
    }
  }
}
