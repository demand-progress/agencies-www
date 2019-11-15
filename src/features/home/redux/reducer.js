import initialState from './initialState';
import { reducer as fetchSheetsReducer } from './fetchSheets';
import { reducer as setAgencyPropReducer } from './setAgencyProp';
import { LOCATION_CHANGE } from 'react-router-redux'
import { filterAgencies } from '../../../common/lib';

const reducers = [
  fetchSheetsReducer,
  setAgencyPropReducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    case LOCATION_CHANGE:
      newState = state;
      newState.filteredAgencies = filterAgencies(state.agencies, action.payload.search)
      break;
    default:
      newState = state;
      break;
  }
  /* istanbul ignore next */
  return reducers.reduce((s, r) => r(s, action), newState);
}
