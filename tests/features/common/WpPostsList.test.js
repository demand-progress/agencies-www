import React from 'react';
import { shallow } from 'enzyme';
import { WpPostsList } from '../../../src/features/common';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<WpPostsList />);
  expect(renderedComponent.find('.common-wp-posts-list').length).toBe(1);
});
