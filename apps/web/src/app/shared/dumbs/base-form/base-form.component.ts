import { Component, EventEmitter, Input, Output } from '@angular/core';
import { validate } from '@scrum/web/core/services/validation/validate.service';

@Component({
  selector: 'scrum-base-form',
  template: ``
})
export abstract class BaseFormComponent<T> {
  @Input() public saveButtonLabel = 'Сохранить';
  @Input() public canDelete = false;
  @Input() public showBack = true;
  @Output() public save = new EventEmitter<T>();
  @Output() public delete = new EventEmitter<T>();

  @Input() public route: string;
  @Input() public queryParams: { [k: string]: string } = {};
  public errors: Record<keyof T, any[]> | null;

  public abstract dto: new () => T;

  public onSave(entity: T) {
    const { valid, errors } = validate(entity, this.dto);
    if (!valid) {
      this.errors = errors;
      console.log(entity);
      console.log(this.errors);
    } else {
      this.errors = null;
      this.save.emit(entity);
    }
  }
}
