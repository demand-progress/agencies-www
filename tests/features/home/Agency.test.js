import React from 'react';
import { shallow } from 'enzyme';
import { Agency } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Agency />);
  expect(renderedComponent.find('.home-agency').length).toBe(1);
});
