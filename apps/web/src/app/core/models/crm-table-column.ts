export interface CrmTableColumn<NameType = string> {
  name?: NameType;
  label?: string;
  sort?: string;
  defaultSort?: boolean;
  class?: string;
  style?: Record<string, any>;
  order?: number;
  required?: boolean;
  skeleton?: {
    shape?: 'rectangle' | 'circle';
    height?: string;
  }

}
