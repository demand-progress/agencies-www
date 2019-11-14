import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'
import bindAllActions from '../common/redux/bindAllActions'
import {
  MemberVotes,
  VoteDetail
} from './'
import {
  withRouter,
  Link
} from 'react-router-dom'
import { VOTE_AGENCIES, pathsChanged, getApiUrl, agencySubtitle } from '../../common/lib'
import { find, propEq, path, join, pluck } from 'ramda'

class Agency extends Component {
  static propTypes = {
    agency: PropTypes.object
  }
  state = {
    open: false,
    activeVote: null
  }
  componentDidUpdate(prevProps, prevState) {
    const { actions, agency } = this.props
    const { open } = this.state
    if (pathsChanged(prevState, this.state, ['open']) && 
      open &&
      !agency.votes) {
      fetch(getApiUrl() + '/?members=' + join(',', pluck('ref', agency.members)))
        .then(res => res.json())
        .then(votes => {
          actions.setAgencyProp(agency.abbreviation, 'votes', votes)
        })
    }
  }
  componentDidMount() {
    const { agency } = this.props
    const agencyAbbrev = path(['match', 'params', 'abbr'], this.props)
    if (agencyAbbrev && agency.abbreviation.toLowerCase() === agencyAbbrev.toLowerCase()) {
      this.setState({
        open: true
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
    const { votes } = agency
    const { activeVote } = this.state
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
          agency={agency}
          member={member}
        /> : null}
      </div>
    </div>
  }
  _vote() {
    const { match, agency } = this.props
    const { votes } = agency 
    const { voteId, abbr } = match.params
    if (!voteId || abbr.toLowerCase() !== agency.abbreviation.toLowerCase() || !votes) {
      return null
    }
    return <div id="modal">
      <div className="wrap">
        <Link to={`/${abbr.toLowerCase()}`} className="close"></Link>
        <VoteDetail 
          agency={agency}
          vote={find(propEq('id', parseInt(voteId, 10)), votes)}
        />
      </div>
    </div>
  }

  render() {
    const { open } = this.state
    const { agency } = this.props
    return (
      <div className={classNames("home-agency", { open })}>
        <a className="header" onClick={() => this.setState({ open: !open })}>
          <h3 className="agency">{agency.agency} <span>({agency.abbreviation})</span></h3>
        </a>
        <div className="bottom">
          {agencySubtitle(agency)}
          <div className="desc">
            Lorem ipsum dolor sit amet turducken shoulder hamburger brisket chuck ball tip turkey pork short ribs pig bresaola. Rump brisket tail, meatball chuck ham leberkas frankfurter sausage corned beef pork flank swine meatloaf andouille. Fatback capicola tongue sirloin, pork jerky pig chuck cow bresaola. 
          </div>
          {this._quorum()}
          <div className="members">
            {agency.members.map(this._member.bind(this))}
          </div>
        </div>
        {this._vote()}
      </div>
    )
  }
}

export default withRouter(bindAllActions(Agency))