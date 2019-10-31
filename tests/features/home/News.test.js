import React from 'react';
import { shallow } from 'enzyme';
import { News } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<News />);
  expect(renderedComponent.find('.home-news').length).toBe(1);
});
