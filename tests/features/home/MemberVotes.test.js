import React from 'react';
import { shallow } from 'enzyme';
import { MemberVotes } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<MemberVotes />);
  expect(renderedComponent.find('.home-member-votes').length).toBe(1);
});
