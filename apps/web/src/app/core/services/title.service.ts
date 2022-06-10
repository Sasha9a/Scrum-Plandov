import { Injectable } from '@angular/core';
import { Title } from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  public constructor(private readonly title: Title) { }

  public setTitle(title: string) {
    this.title.setTitle(title ? `${title} - Scrum` : 'Scrum');
  }

}
