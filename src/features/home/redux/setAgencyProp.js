// Rekit uses a new approach to organizing actions and reducers. That is
// putting related actions and reducers in one file. See more at:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da

import {
  HOME_SET_AGENCY_PROP,
} from './constants';

export function setAgencyProp(abbr, prop, val) {
  return {
    type: HOME_SET_AGENCY_PROP,
    data: {
      abbr,
      prop,
      val
    }
  }
}


export function reducer(state, action) {
  switch (action.type) {
    case HOME_SET_AGENCY_PROP:
      const agencyMap = a => {
        if (a.abbreviation === action.data.abbr) {
          const ret = { ...a }
          ret[action.data.prop] = action.data.val
          return ret
        }
        return a
      }
      return {
        ...state,
        agencies: state.agencies.map(agencyMap),
        filteredAgencies: state.filteredAgencies.map(agencyMap)
      }

    default:
      return state
  }
}
