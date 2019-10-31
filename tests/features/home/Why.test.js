import React from 'react';
import { shallow } from 'enzyme';
import { Why } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Why />);
  expect(renderedComponent.find('.home-why').length).toBe(1);
});
