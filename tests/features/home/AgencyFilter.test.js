import React from 'react';
import { shallow } from 'enzyme';
import { AgencyFilter } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<AgencyFilter />);
  expect(renderedComponent.find('.home-agency-filter').length).toBe(1);
});
