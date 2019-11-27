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
    { path: 'news', name: 'News', component: News },
    { path: 'about', name: 'About', component: Why },
    {
      path: ':abbr/:voteId?',
      name: 'vote',
      component: DefaultPage,
      exact: false
    },
  ],
};
