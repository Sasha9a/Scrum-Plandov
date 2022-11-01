import { PaginationResultDto } from '@scrum/shared/dtos/pagination.result.dto';
import { UserDto } from '@scrum/shared/dtos/user/user.dto';
import { Expose } from 'class-transformer';

@Expose()
export class UserResultFindAllDto extends PaginationResultDto {
  @Expose()
  public items: UserDto[];
}
