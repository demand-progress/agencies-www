import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import bindAllActions from '../common/redux/bindAllActions'
import classNames from 'classnames'
import {
  Agency,
  AgencyFilter
} from './'
import {
  WpContent
} from '../common'
import { last, find, propEq, flatten, pluck } from 'ramda'
import { VOTE_AGENCIES } from '../../common/lib';

class DefaultPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    const { agencies, filteredAgencies } = this.props.home
    const members = flatten(pluck('members', agencies))
    const getStatus = status => {
      return members.filter(propEq('term status', status))
    }
    let agShow
    const vacants = getStatus('Vacant')
    const expireds = getStatus('Expired')
    if (agencies.length > 0) {
      agShow = <div className="agencies">
        <div className="wrap">
          <WpContent id={40} />
          <div className="stats">
            <div className="stat">
              <div className="num">{vacants.length}</div>
              <h3>VACANT SEATS</h3>
              <div className="party">
                <span className="dem">{vacants.filter(propEq('political party', 'Democrat')).length} Democrat,</span>
                <span className="rep"> {vacants.filter(propEq('political party', 'Republican')).length} Republican,</span>
                <span className="np"><br/>{vacants.filter(propEq('political party', 'N/A')).length} Non Partisan</span>
              </div>
            </div>
            <div className="stat">
              <div className="num">{expireds.length}</div>
              <h3>EXPIRED SEATS</h3>
              <div className="party">
                <span className="dem">{expireds.filter(propEq('political party', 'Democrat')).length} Democrat,</span>
                <span className="rep"> {expireds.filter(propEq('political party', 'Republican')).length} Republican,</span>
                <span className="np"><br/>{expireds.filter(propEq('political party', 'N/A')).length} Non Partisan</span>
              </div>
            </div>
            <div className="stat">
              <div className="num">{getStatus('Pending').length}</div>
              <h3>PENDING<br/>NOMINATIONS</h3>
            </div>
          </div>
          <AgencyFilter />
          <div className="legend">
            <div className="label">Legend:</div>
            <div className="dem">
              <div className="box"></div>
              Democratic Seat
            </div>
            <div className="rep">
              <div className="box"></div>
              Republican Seat
            </div>
            <div className="np">
              <div className="box"></div>
              Non-Partisan Seat
            </div>
            <div className="exp">
              <div className="box"></div>
              Expired Seat
            </div>
            <div className="pend">
              <div className="box"></div>
              Pending Seat
            </div>
            <div className="vac">
              <div className="box"></div>
              Vacant Seat
            </div>
          </div>
          {filteredAgencies.map(a => <Agency agency={a} key={a.abbreviation} />)}
        </div>
      </div>
    }
    const voteAgencies = <div className="vote-agencies">
      {VOTE_AGENCIES.map(abbr => {
        let recentVote
        if (agencies) {
          const agency = find(propEq('abbreviation', abbr), agencies)
          if (agency && agency.votes) {
            const vote = last(agency.votes)
            if (vote) {
              recentVote = <Link className="recent" to={`/${abbr.toLowerCase()}/${vote.id}`}>{`${vote.title} - ${vote.vote_date}`}</Link>
            }
          }
        }
        return <div key={abbr} className={classNames("vote-agency", abbr.toLowerCase())}>
          <Link 
            to={`/?s=${abbr.toLowerCase()}`}
            className="seal"
            >{abbr}</Link>
            {recentVote}
        </div>
      })}
    </div>
    return (
      <div className="home-default-page">
        <div className="wrap">
          <WpContent id={2} />
          {voteAgencies}
        </div>
        {agShow}
      </div>
    );
  }
}

export default bindAllActions(DefaultPage)