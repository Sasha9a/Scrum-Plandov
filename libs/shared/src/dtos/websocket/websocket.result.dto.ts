import { Expose } from "class-transformer";

@Expose()
export class WebsocketResultDto<T = any> {

  @Expose()
  public success: boolean;

  @Expose()
  public error: string;

  @Expose()
  public result: T;

}
