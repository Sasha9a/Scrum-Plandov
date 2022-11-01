import { Expose } from 'class-transformer';

@Expose()
export class PaginationResultDto {
  @Expose()
  public count: number;
}
