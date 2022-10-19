import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardModule } from '@scrum/api/modules/board/board.module';
import { FileModule } from '@scrum/api/modules/file/file.module';
import { SprintController } from '@scrum/api/modules/sprint/sprint.controller';
import { SprintGateway } from '@scrum/api/modules/sprint/sprint.gateway';
import { SprintService } from '@scrum/api/modules/sprint/sprint.service';
import { TaskModule } from '@scrum/api/modules/task/task.module';
import { UserModule } from '@scrum/api/modules/user/user.module';
import { SprintSchema } from '@scrum/shared/schemas/sprint.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Sprint', schema: SprintSchema }]),
    forwardRef(() => BoardModule),
    forwardRef(() => TaskModule),
    UserModule,
    FileModule
  ],
  controllers: [SprintController],
  providers: [SprintService, SprintGateway],
  exports: [SprintService, SprintGateway]
})
export class SprintModule {}
