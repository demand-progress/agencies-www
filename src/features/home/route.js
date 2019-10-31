import {
  DefaultPage,
  News,
  Why,
} from './';

export default {
  path: '/',
  name: 'Home',
  childRoutes: [
    { path: 'default-page',
      name: 'Default page',
      component: DefaultPage,
      isIndex: true,
    },
    { path: 'news', name: 'News', component: News },
    { path: 'why', name: 'Why', component: Why },
  ],
};
