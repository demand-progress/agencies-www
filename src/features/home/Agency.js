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
import { VOTE_AGENCIES, pathsChanged, agencySubtitle } from '../../common/lib'
import { findIndex, find, propEq, path, join, pluck } from 'ramda'

const PRESIDENTS = [{
  start: '1-20-1993',
  name: 'Bill Clinton'
},{
  start: '1-20-2001',
  name: 'George W Bush'
},{
  start: '1-20-2009',
  name: 'Barack Obama'
},{
  start: '1-20-2017',
  name: 'Donald Trump'
},{
  start: '1-20-2021',
  name: 'Joe Biden'
}].reverse()

class Agency extends Component {
  static propTypes = {
    agency: PropTypes.object
  }
  state = {
    open: false,
    activeVote: null,
    lastPath: '',
    jumpedTo: false
  }
  componentDidMount() {
    const { actions, agency } = this.props
    const agencyAbbrev = path(['match', 'params', 'abbr'], this.props)
    if (agencyAbbrev && agency.abbreviation.toLowerCase() === agencyAbbrev.toLowerCase()) {
      this.setState({
        open: true
      })
    }
  }
  componentDidUpdate() {
    const { lastPath, jumpedTo } = this.state
    const { agency } = this.props
    const { pathname } = this.props.location
    if (lastPath !== pathname) {
      const regex = new RegExp('^/' + agency.abbreviation, 'i')
      const st8 = {
        lastPath: pathname
      }
      if (regex.test(pathname)) {
        if (!jumpedTo) {
          window.scrollTo(0, this.ref.offsetTop - 200)
          st8.jumpedTo = true
        }
      } else {
        st8.jumpedTo = false
      }
      this.setState(st8)
    }
  }
  _quorum() {
    const { agency } = this.props
    if (agency['currently enough for quorum'] === 'N/A') return
    let reached = false
    if (agency['currently enough for quorum'] === 'Yes') {
      reached = true
    }

    return <div className={classNames("quorum", { reached })}>
      <span>
        Quorum ({agency['required for quorum']})?
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
    let term, termAlert, leftDetails = '', rightDetails, nominatedBy
    if (status !== 'vacant') {
      const nextPresI = findIndex(pres => moment(pres.start, 'M-DD-YYYY').valueOf() < dateReceived.valueOf(), PRESIDENTS)
      if (nextPresI > -1) {
        nominatedBy = `Nominated by ${PRESIDENTS[nextPresI].name}`
      }
    }
    if (termExpires.isValid()) {
      if (termExpires.valueOf() < Date.now()) {
        term = `Term Expired ${termExpires.fromNow()}`
      } else {
        term = `Term Expires ${termExpires.format(fmt)}`
      }
      if (lastAction.isValid()) {
        if (nominatedBy) {
          leftDetails += nominatedBy + ', '
        }
        leftDetails += `Confirmed ${lastAction.format(fmt)}`
        if (dateReceived.isValid()) {
          leftDetails += ` after ${parseInt(moment.duration(lastAction.diff(dateReceived)).asDays(), 10)} days pending`
        }
      }
    }
    if (mustVacate.isValid()) {
      rightDetails = 'Must Vacate by ' + mustVacate.format(fmt)
    }
    let position = <span className="position">{member.position}</span>
    if (status === 'pending') {
      position = ''
      if (member['replacing'] === name) {
        name = 'Pending Reappointment: ' + name
      } else {
        name = 'Pending: ' + name
      }
      if (nominatedBy) {
        leftDetails = nominatedBy
      } else {
        leftDetails = ''
      }
      if (member['replacing'] !== member.name) {
        leftDetails += ' to replace ' + member['replacing']
      }
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
            {name} {position} 
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
          activeVote={activeVote || (agency.votes ? agency.votes[agency.votes.length - 1].id : null)}
          agency={agency}
          member={member}
        /> : null}
      </div>
    </div>
  }
  _vote() {
    const { location, match, agency } = this.props
    const { votes } = agency 
    const { voteId, abbr } = match.params
    if (!voteId || abbr.toLowerCase() !== agency.abbreviation.toLowerCase() || !votes) {
      return null
    }
    const voteI = findIndex(propEq('id', parseInt(voteId, 10)), votes)
    const vote = votes[voteI]
    let pagination
    if (votes.length > 1) {
      pagination = <div className="pagination">
        <h4>View More Votes by the {agency.abbreviation}</h4>
        <div className="pages">
          {voteI > 0 ? <Link to={`/${abbr.toLowerCase()}/${votes[voteI - 1].id}`}>{votes[voteI - 1].title}</Link> : <div />}
          {voteI < votes.length - 1 ? <Link className="right" to={`/${abbr.toLowerCase()}/${votes[voteI + 1].id}`}>{votes[voteI + 1].title}</Link> : <div />}
        </div>
      </div>
    }
    return <div id="modal">
      <div className="wrap">
        <Link to={`/${abbr.toLowerCase()}${location.search}`} className="close"></Link>
        <VoteDetail 
          agency={agency}
          vote={vote}
        />
        {pagination}
      </div>
    </div>
  }
  _legend() {
    const { agency } = this.props
    const { votes } = agency
    if (!votes) {
      return null
    }
    return <div className="legend">
            <div className="good">
              <div className="box"></div>
              Voted with Agency Spotlight principles
            </div>
            <div className="rep">
              <div className="box"></div>
              Voted against Agency Spotlight principles
            </div>
            <div className="nv">
              <div className="box"></div>
              Did Not Vote
            </div>
            <div className="inel">
              <div className="box"></div>
              Ineligible
            </div>
    </div>
  }

  render() {
    const { open } = this.state
    const { agency } = this.props
    return (
      <div ref={ref => this.ref = ref} className={classNames("home-agency", { open })} id={agency.abbreviation}>
        <a className="header" onClick={() => this.setState({ open: !open })}>
          <h3 className="agency">{agency.agency} <span>({agency.abbreviation})</span></h3>
        </a>
        <div className="bottom">
          {agencySubtitle(agency)}
          <div className="desc">
            {agency['agency description']}
          </div>
          {this._quorum()}
          {this._legend()}
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