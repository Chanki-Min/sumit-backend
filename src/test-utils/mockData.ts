import { Page } from '@src/models/pages/entities/page.entity';

export const pageArray: Page[] = [
  {
    uuid: '1-1-1-1',
    user_uuid: 'ck',
    title: 'sample-title',
    description: 'sample-desc',
    share: false,
    hashtags: [],
    createAt: new Date(2022, 0),
    updateAt: new Date(2022, 0),
    slides: [],
  },
  {
    uuid: '2-2-2-2',
    user_uuid: 'ck',
    title: 'sample-title2',
    description: 'sample-desc2',
    share: true,
    hashtags: ['sample-hash'],
    createAt: new Date(2022, 0, 2),
    updateAt: new Date(2022, 0, 2),
    slides: [],
  },
];

export const onePage: Page = {
  uuid: '1',
  user_uuid: 'ck',
  title: 'title#1',
  description: 'desc#1',
  share: false,
  hashtags: [],
  createAt: new Date(2022, 0),
  updateAt: new Date(2022, 0),
  slides: [],
};
