import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BoardModule } from "@scrum/api/modules/board/board.module";
import { SprintDashboardGateway } from "@scrum/api/modules/sprint/sprint-dashboard.gateway";
import { SprintController } from "@scrum/api/modules/sprint/sprint.controller";
import { SprintService } from "@scrum/api/modules/sprint/sprint.service";
import { TaskModule } from "@scrum/api/modules/task/task.module";
import { UserModule } from "@scrum/api/modules/user/user.module";
import { SprintSchema } from "@scrum/shared/schemas/sprint.schema";
import { SprintGateway } from "@scrum/api/modules/sprint/sprint.gateway";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Sprint", schema: SprintSchema }]),
    forwardRef(() => BoardModule),
    forwardRef(() => TaskModule),
    UserModule
  ],
  controllers: [SprintController],
  providers: [SprintService, SprintDashboardGateway, SprintGateway],
  exports: [SprintService, SprintDashboardGateway, SprintGateway]
})
export class SprintModule {}
