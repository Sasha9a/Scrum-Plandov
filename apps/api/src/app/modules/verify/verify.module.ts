import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "@scrum/api/modules/user/user.module";
import { VerifyController } from "@scrum/api/modules/verify/verify.controller";
import { VerifyService } from "@scrum/api/modules/verify/verify.service";
import { VerifySchema } from "@scrum/shared/schemas/verify.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Verify", schema: VerifySchema }]),
    forwardRef(() => UserModule)
  ],
  controllers: [VerifyController],
  providers: [VerifyService],
  exports: [VerifyService]
})
export class VerifyModule {}
