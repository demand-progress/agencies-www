import {
  HOME_SET_AGENCY_PROP,
} from '../../../../src/features/home/redux/constants';

import {
  setAgencyProp,
  reducer,
} from '../../../../src/features/home/redux/setAgencyProp';

describe('home/redux/setAgencyProp', () => {
  it('returns correct action by setAgencyProp', () => {
    expect(setAgencyProp()).toHaveProperty('type', HOME_SET_AGENCY_PROP);
  });

  it('handles action type HOME_SET_AGENCY_PROP correctly', () => {
    const prevState = {};
    const state = reducer(
      prevState,
      { type: HOME_SET_AGENCY_PROP }
    );
    // Should be immutable
    expect(state).not.toBe(prevState);

    // TODO: use real case expected value instead of {}.
    const expectedState = {};
    expect(state).toEqual(expectedState);
  });
});
