import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames'
import moment from 'moment'

export default class Agency extends Component {
  static propTypes = {
    agency: PropTypes.object
  }
  state = {
    open: false
  }
  _quorum() {
    const { agency } = this.props
    if (agency['currently enough for quorum'] === 'N/A') return
    let reached = false
    let label = 'No Quorum'
    if (agency['currently enough for quorum'] === 'Yes') {
      reached = true
      label = 'Quorum'
    }
    const votingMembers = parseInt(agency['voting members'], 10)
    const vacancies = parseInt(agency['vacancies'], 10)

    return <div className={classNames("quorum", { reached })}>
      {label} ({votingMembers - vacancies}/{votingMembers})
    </div>
  }
  _member(member, i){
    const termExpires = moment(member['term expires'], 'M/DD/YYYY')
    let status = member['term status'].toLowerCase()
    const party = (member['political party'] || '').toLowerCase()
    let name = member.name
    let term, termAlert
    if (termExpires.isValid()) {
      if (termExpires.valueOf() < Date.now()) {
        term = `Term Expired ${termExpires.fromNow()}`
        status = 'expired' 
      } else {
        term = `Term Expires ${termExpires.format('M/D/YYYY')}`
      }
    }
    if (status === 'pending') {
      name = 'Pending Nomination: ' + name
    }
    return <div className={classNames("member", status, party)} key={i}>
      <div className="status"></div>
      <div className="info">
        <div className="top">
          <div className="name">
            {name} <span className="position">{member.position}</span>
          </div>
          <div className="term">
            {term}
          </div>
        </div>
        <div className="bottom">
        </div>
      </div>
    </div>

  }

  render() {
    const { agency } = this.props
    return (
      <div className="home-agency">
        <a className="header">
          <h3>{agency.agency} <span>({agency.abbreviation})</span></h3>
        </a>
        <div className="bottom">
          <div className="subtitle">
            <div>
              <div className="label">Established by Statute:</div>
              {agency.statute}
            </div>
            <div>
              <div className="label">Committee of Jurisdiction:</div>
              {agency['senate committee with jurisdiction']}
            </div>
            <div>
              <div className="label">Partisan Balance:</div>
              {agency['political balance required'] === 'Yes' ? 'Required' : 'Not Required'}
            </div>
          </div>
          <div className="desc">
            Lorem ipsum dolor sit amet turducken shoulder hamburger brisket chuck ball tip turkey pork short ribs pig bresaola. Rump brisket tail, meatball chuck ham leberkas frankfurter sausage corned beef pork flank swine meatloaf andouille. Fatback capicola tongue sirloin, pork jerky pig chuck cow bresaola. 
          </div>
          {this._quorum()}
          {agency.members.map(this._member.bind(this))}
        </div>
      </div>
    );
  }
}
