import React from 'react';
import { shallow } from 'enzyme';
import { VoteDetail } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<VoteDetail />);
  expect(renderedComponent.find('.home-vote-detail').length).toBe(1);
});
