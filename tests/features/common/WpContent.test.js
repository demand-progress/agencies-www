import React from 'react';
import { shallow } from 'enzyme';
import { WpContent } from '../../../src/features/common';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<WpContent />);
  expect(renderedComponent.find('.common-wp-content').length).toBe(1);
});
