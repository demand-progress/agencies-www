import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_FETCH_SHEETS_BEGIN,
  HOME_FETCH_SHEETS_SUCCESS,
  HOME_FETCH_SHEETS_FAILURE,
  HOME_FETCH_SHEETS_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  fetchSheets,
  dismissFetchSheetsError,
  reducer,
} from '../../../../src/features/home/redux/fetchSheets';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/fetchSheets', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when fetchSheets succeeds', () => {
    const store = mockStore({});

    return store.dispatch(fetchSheets())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_FETCH_SHEETS_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_FETCH_SHEETS_SUCCESS);
      });
  });

  it('dispatches failure action when fetchSheets fails', () => {
    const store = mockStore({});

    return store.dispatch(fetchSheets({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_FETCH_SHEETS_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_FETCH_SHEETS_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissFetchSheetsError', () => {
    const expectedAction = {
      type: HOME_FETCH_SHEETS_DISMISS_ERROR,
    };
    expect(dismissFetchSheetsError()).toEqual(expectedAction);
  });

  it('handles action type HOME_FETCH_SHEETS_BEGIN correctly', () => {
    const prevState = { fetchSheetsPending: false };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_SHEETS_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchSheetsPending).toBe(true);
  });

  it('handles action type HOME_FETCH_SHEETS_SUCCESS correctly', () => {
    const prevState = { fetchSheetsPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_SHEETS_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchSheetsPending).toBe(false);
  });

  it('handles action type HOME_FETCH_SHEETS_FAILURE correctly', () => {
    const prevState = { fetchSheetsPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_SHEETS_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchSheetsPending).toBe(false);
    expect(state.fetchSheetsError).toEqual(expect.anything());
  });

  it('handles action type HOME_FETCH_SHEETS_DISMISS_ERROR correctly', () => {
    const prevState = { fetchSheetsError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_SHEETS_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.fetchSheetsError).toBe(null);
  });
});

