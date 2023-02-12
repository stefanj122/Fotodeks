import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './guards/role.guard';
import { HomeModule } from './home/home.module';
import { ImagesModule } from './images/images.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      port: parseInt(process.env.DATABASE_PORT),
      entities: ['./dist/entitie/*.entitie.js'],
      synchronize: true,
      migrations: ['./dist/migration/*.js'],
      autoLoadEntities: true,
    }),
    UsersModule,
    ImagesModule,
    AuthModule,
    AdminModule,
    HomeModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}
