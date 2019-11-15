import React, { Component } from 'react'
import bindAllActions from '../common/redux/bindAllActions'
import { Link, withRouter } from 'react-router-dom'
import { parse, stringify } from 'query-string'
import { uniq, identity, sortBy, length, map, lift, pluck, filter, pipe } from 'ramda'
import { agencyExpireds, agenciesWithStatus } from '../../common/lib'

class AgencyFilter extends Component {
  static propTypes = {

  }
  _pushQuery(queryObj) {
    const { history, location } = this.props
    const go = location.pathname + '?' + stringify(Object.assign(parse(location.search), queryObj)) 
    this.props.history.push(go)
  }

  render() {
    const { home, location, history } = this.props
    const { agencies } = home
    const queries = parse(location.search)
    const countAndSort = pipe(
      map(length),
      uniq,
      sortBy(identity)
    )
    const expiredCounts = pipe(
      agenciesWithStatus('expired'),
      countAndSort
    )(agencies || [])
    const vacantCounts = pipe(
      agenciesWithStatus('vacant'),
      countAndSort
    )(agencies || [])
    const comms = pipe(
      pluck('senate committee with jurisdiction'),
      uniq,
      sortBy(identity)
    )(agencies || [])
    const queryVals = filter(identity, Object.values(queries))
    return (
      <div className="home-agency-filter">
        <div className="top">
          <h4>Filter Agencies:</h4>
          <div>
            {queryVals.length > 0 ? <Link to={location.pathname}>(clear filters)</Link> : null}
          </div>
        </div>
        <div className="bottom">
          <label>
            <input type="checkbox" checked={queries.tracker || false} onChange={evt => {
              this._pushQuery({
                tracker: evt.target.checked ? '1' : ''
              })
            }}  /> With Voting Record
          </label>
          <label>
            <input type="checkbox" checked={queries.noQuorum || false} onChange={evt => {
              this._pushQuery({
                noQuorum: evt.target.checked ? '1' : ''
              })
            }}  /> Without Quorum
          </label>
          <div>
            <input 
              type="text"  
              value={queries.s || ''}
              onChange={(evt) => {
                this._pushQuery({
                  s: evt.target.value
                })
              }} 
              placeholder="type to search" 
            />
          </div>
        </div>
        <div className="bottom">
          <label>
            Committee of Jurisdiction:&nbsp;&nbsp;
            <select
              value={queries.committee}
              onChange={evt => {
                this._pushQuery({
                  committee: evt.target.value
                })
              }}
            >
              <option value=""></option>
              {comms.map(c => <option key={'comms-' + c} value={c}>{c}</option>)}
            </select>
          </label>
          <label>
            # of Expired Seats:&nbsp;&nbsp;
            <select
              value={queries.expireds}
              onChange={evt => {
                this._pushQuery({
                  expireds: evt.target.value
                })
              }}
            >
              <option value=""></option>
              {expiredCounts.map(c => <option key={'expired-' + c} value={c}>{c}</option>)}
            </select>
          </label>
          <label>
            # of Vacant Seats:&nbsp;&nbsp;
            <select
              value={queries.vacant}
              onChange={evt => {
                this._pushQuery({
                  vacant: evt.target.value
                })
              }}
            >
              <option value=""></option>
              {vacantCounts.map(c => <option key={'vacant-' + c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>
      </div>
    );
  }
}

export default withRouter(bindAllActions(AgencyFilter))