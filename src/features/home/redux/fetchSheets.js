import {
  HOME_FETCH_SHEETS_BEGIN,
  HOME_FETCH_SHEETS_SUCCESS,
  HOME_FETCH_SHEETS_FAILURE,
  HOME_FETCH_SHEETS_DISMISS_ERROR,
} from './constants';
import { propEq } from 'ramda'
import bindAllActions from '../../common/redux/bindAllActions';
import { filterAgencies } from '../../../common/lib';
const GSheetReader = require('../../../common/lib/g-sheets-api')

// Rekit uses redux-thunk for async actions by default: https://github.com/gaearon/redux-thunk
// If you prefer redux-saga, you can use rekit-plugin-redux-saga: https://github.com/supnate/rekit-plugin-redux-saga
export function fetchSheets(search) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: HOME_FETCH_SHEETS_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doc = '1cd_DVCWvzNdgOZZFtuu_UQcIPC5hwNzXRpTLont8Pek'
      // const doc = '1hH0Z-OWfEoMrhqQYtfO46nPfA2JXl34ooD_QeB1-40s'
      GSheetReader({ sheetId: `${doc}/2` }, agencies => {
        GSheetReader({ sheetId: `${doc}/1` }, members => {
          agencies.forEach(ag => {
            ag.members = members.filter(propEq('agency', ag.agency))
          })
          console.log(agencies);
          dispatch({
            type: HOME_FETCH_SHEETS_SUCCESS,
            data: agencies,
            filteredAgencies: filterAgencies(agencies, search)
          })
          resolve(agencies)
        })
      })
    })
    return promise
  }
}

// Async action saves request error by default, this method is used to dismiss the error info.
// If you don't want errors to be saved in Redux store, just ignore this method.
export function dismissFetchSheetsError() {
  return {
    type: HOME_FETCH_SHEETS_DISMISS_ERROR,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case HOME_FETCH_SHEETS_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        fetchSheetsPending: true,
        fetchSheetsError: null,
      };

    case HOME_FETCH_SHEETS_SUCCESS:
      // The request is success
      return {
        ...state,
        fetchSheetsPending: false,
        fetchSheetsError: null,
        agencies: action.data,
        filteredAgencies: action.filteredAgencies
      };

    case HOME_FETCH_SHEETS_FAILURE:
      // The request is failed
      return {
        ...state,
        fetchSheetsPending: false,
        fetchSheetsError: action.data.error,
      };

    case HOME_FETCH_SHEETS_DISMISS_ERROR:
      // Dismiss the request failure error
      return {
        ...state,
        fetchSheetsError: null,
      };

    default:
      return state;
  }
}
