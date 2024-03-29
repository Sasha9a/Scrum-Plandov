import { ConfigInterface } from '@scrum/shared/interfaces/config.interface';

export const environment: ConfigInterface = {
  production: true,
  secret: process.env.SECRET || 'd2103dfe7288ccb50a4a7af9ff90ec52',
  db: process.env.DB || 'mongodb://localhost:27017/scrum',
  expiresIn: Number(process.env.EXPIRES_IN) || 2592000,
  mail: {
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    from: 'Scrum <scrum.plandov@mail.ru>',
    auth: {
      user: 'scrum.plandov@mail.ru',
      pass: 'j9XUZgEgjddADsyVyp50'
    }
  },
  url: 'https://scrum.plandov.ru'
};
