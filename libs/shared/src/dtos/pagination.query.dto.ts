import { Expose } from 'class-transformer';
import { IsDefined, IsOptional, Max, Min } from 'class-validator';

@Expose()
export class PaginationQueryDto {
  @Expose()
  @IsDefined({ message: 'Лимит обязательный' })
  @Min(0, { message: 'Лимит должен быть положительный' })
  @Max(200, { message: 'Максимальный лимит 200' })
  public limit: number;

  @Expose()
  @IsDefined({ message: 'Отступ обязательный' })
  @Min(0, { message: 'Отступ должен быть положительный' })
  public offset: number;

  @Expose()
  @IsOptional()
  public sort?: string;

  @Expose()
  @IsOptional()
  public search?: string;
}
