import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LoggerMiddleware } from "@scrum/api/core/middlewares/logger.middleware";
import { BoardModule } from "@scrum/api/modules/board/board.module";
import { ColumnBoardModule } from "@scrum/api/modules/column-board/column-board.module";
import { FileModule } from "@scrum/api/modules/file/file.module";
import { ReportModule } from "@scrum/api/modules/report/report.module";
import { SprintModule } from "@scrum/api/modules/sprint/sprint.module";
import { TaskModule } from "@scrum/api/modules/task/task.module";
import { UserModule } from "@scrum/api/modules/user/user.module";
import { VerifyModule } from "@scrum/api/modules/verify/verify.module";
import { environment } from "../environments/environment";
import { JobRecordModule } from "@scrum/api/modules/job-record/job.record.module";

@Module({
  imports: [
    MongooseModule.forRoot(environment.db, {
      connectionFactory: (connection) => {
        connection.plugin(require('mongoose-autopopulate'));
        return connection;
      }
    }),
    FileModule,
    UserModule,
    VerifyModule,
    BoardModule,
    SprintModule,
    TaskModule,
    ColumnBoardModule,
    JobRecordModule,
    ReportModule
  ]
})
export class AppModule implements NestModule {

  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL
    });
  }

}
