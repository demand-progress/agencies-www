import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { find, propEq } from 'ramda'
import {
  isMobile
} from 'react-device-detect'
import { 
  Link,
  withRouter
} from 'react-router-dom'


class MemberVotes extends Component {
  static propTypes = {
    member: PropTypes.object.isRequired,
    onVoteHover: PropTypes.func,
    agency: PropTypes.object
  }
  state = {
    activeVote: null
  }
  _votes() {
    const { history, location, agency, member, onVoteHover, activeVote } = this.props
    const { votes } = agency
    return <div className="votes">
      {(votes || []).map((v, i) => {
        let memberVote = v.member_votes[member.ref]
        if (!memberVote) {
          memberVote = 'ineligible'
        }
        const cls = classNames('vote', memberVote, {
          bad: memberVote !== v.preferred_vote,
          good: memberVote === v.preferred_vote,
          active: activeVote === v.id
        })
        const to = `/${agency.abbreviation.toLowerCase()}/${v.id}${location.search}`
        if (isMobile) {
          return <a onClick={() => {
            if (activeVote === v.id) {
              history.push(to)
            } else {
              if (onVoteHover) {
                onVoteHover(v.id)
              }
            }
          }} className={cls}>
            <div className="block" />
            <span className="vote-label">{memberVote}</span>
          </a>
        }
        return <Link
            to={to}
            className={cls} 
            key={i}
            onMouseLeave={() => {
              if (onVoteHover) {
                onVoteHover(null)
              }
            }}
            onMouseEnter={() => {
              if (onVoteHover) {
                onVoteHover(v.id)
              }
            }}
          >
            <div className="block" />
            <span className="vote-label">{memberVote}</span>
          </Link>
      })}
    </div>
  }

  render() {
    const { member, activeVote, agency, location } = this.props
    const { votes } = agency
    if (member['term status'].toLowerCase() === 'vacant') return <div />
    let voteTitle
    if (activeVote !== null) {
      const vote = find(propEq('id', activeVote), votes)
      voteTitle = <Link to={`/${agency.abbreviation.toLowerCase()}/${vote.id}${location.search}`}>
        <span className="sp">&nbsp;</span>{vote.title}
        <small> {isMobile ? '(tap box twice for more info)' : '(click box for more info)'}</small>
      </Link>
    }
    return (
      <div className="home-member-votes">
        <h3 className="key">
          Record on Key Votes:
          {voteTitle}
        </h3>
        {this._votes()}
      </div>
    );
  }
}

export default withRouter(MemberVotes)