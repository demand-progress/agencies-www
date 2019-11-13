import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'
import {
  MemberVotes
} from './'
import { VOTE_AGENCIES, pathsChanged, getApiUrl } from '../../common/lib'
import { join, pluck } from 'ramda'

export default class Agency extends Component {
  static propTypes = {
    agency: PropTypes.object
  }
  state = {
    open: false,
    votes: null,
    activeVote: null
  }
  componentDidUpdate(prevProps, prevState) {
    const { agency } = this.props
    const { open, votes } = this.state
    if (pathsChanged(prevState, this.state, ['open']) && 
      open &&
      !votes) {
      fetch(getApiUrl() + '/?members=' + join(',', pluck('ref', agency.members)))
        .then(res => res.json())
        .then(votes => {
          this.setState({
            votes
          })
        })
    }
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
      <span>
        {label} ({votingMembers - vacancies}/{votingMembers})
      </span>
    </div>
  }
  _member(member, i){
    const { agency } = this.props
    const { activeVote, votes } = this.state
    const fmt = 'M/D/YYYY'
    const termExpires = moment(member['term expires'], 'M/DD/YYYY')
    const mustVacate = moment(member['must vacate seat by'], 'M/DD/YYYY')
    const lastAction = moment(member['latest action'], 'M/DD/YYYY') 
    const dateReceived = moment(member['dated received from president'], 'M/DD/YYYY') 
    let status = member['term status'].toLowerCase()
    const party = (member['political party'] || '').toLowerCase()
    let name = member.name
    let term, termAlert, leftDetails, rightDetails
    if (termExpires.isValid()) {
      if (termExpires.valueOf() < Date.now()) {
        term = `Term Expired ${termExpires.fromNow()}`
      } else {
        term = `Term Expires ${termExpires.format(fmt)}`
      }
      if (lastAction.isValid()) {
        leftDetails = `Appointed ${lastAction.format(fmt)}`
        if (dateReceived.isValid()) {
          leftDetails += ` after ${parseInt(moment.duration(lastAction.diff(dateReceived)).asDays(), 10)} days pending`
        }
      }
    }
    if (mustVacate.isValid()) {
      rightDetails = 'Must Vacate by ' + mustVacate.format(fmt)
    }
    if (status === 'pending') {
      name = 'Pending: ' + name
      leftDetails = ''
      if (dateReceived.isValid()) {
        term = `Nominated ${dateReceived.fromNow()}`
      }
      if (lastAction.isValid()) {
        rightDetails = `Latest Congressional action ${lastAction.fromNow()} `
      }
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
          <div className="left">
            {leftDetails}
          </div>
          <div className="right">
            {rightDetails}
          </div>
        </div>
        {VOTE_AGENCIES.includes(agency.abbreviation) ? <MemberVotes 
          onVoteHover={voteI => {
            this.setState({
              activeVote: voteI
            })
          }}
          activeVote={activeVote}
          member={member}
          votes={votes}
        /> : null}
      </div>
    </div>

  }

  render() {
    const { open } = this.state
    const { agency } = this.props
    return (
      <div className={classNames("home-agency", { open })}>
        <a className="header" onClick={() => this.setState({ open: !open })}>
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
          <div className="members">
            {agency.members.map(this._member.bind(this))}
          </div>
        </div>
      </div>
    );
  }
}
