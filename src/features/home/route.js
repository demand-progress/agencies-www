import {
  DefaultPage,
  News,
  Why,
} from './';

export default {
  path: '/',
  name: 'Home',
  childRoutes: [
    { 
      name: 'home',
      component: DefaultPage,
      exact: false,
      isIndex: true,
    },
    {
      path: ':abbr/:voteId?',
      name: 'vote',
      component: DefaultPage,
      exact: false
    },
    { path: 'news', name: 'News', component: News },
    { path: 'why', name: 'Why', component: Why },
  ],
};
