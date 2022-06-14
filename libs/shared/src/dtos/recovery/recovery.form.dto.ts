import { Expose, Transform } from "class-transformer";
import { IsEmail } from "class-validator";

@Expose()
export class RecoveryFormDto {

  @Expose()
  @IsEmail({}, { message: "Невалидный email" })
  @Transform((element) => element.value?.toLowerCase())
  public email: string;

}
