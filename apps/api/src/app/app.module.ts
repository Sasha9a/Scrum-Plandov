import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LoggerMiddleware } from "@scrum/api/core/middlewares/logger.middleware";
import { FileModule } from "@scrum/api/modules/file/file.module";
import { UserModule } from "@scrum/api/modules/user/user.module";
import { VerifyModule } from "@scrum/api/modules/verify/verify.module";
import { environment } from "../environments/environment";

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
    VerifyModule
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
