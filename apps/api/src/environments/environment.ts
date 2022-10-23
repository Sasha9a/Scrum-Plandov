import { ConfigInterface } from '@scrum/shared/interfaces/config.interface';

export const environment: ConfigInterface = {
  production: false,
  secret: process.env.SECRET || 'd2103dfe7288ccb50a4a7af9ff90ec52',
  db: process.env.DB || 'mongodb://localhost:27017/scrum',
  expiresIn: Number(process.env.EXPIRES_IN) || 2592000,
  mail: {
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    from: 'Scrum <aleksander.dovgiy@yandex.ru>',
    auth: {
      user: 'aleksander.dovgiy',
      pass: 'nbwbculshslypfpd'
    }
  },
  url: 'http://localhost:4200'
};
