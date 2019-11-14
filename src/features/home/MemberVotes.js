import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { find, propEq } from 'ramda'
import { 
  Link
} from 'react-router-dom'

export default class MemberVotes extends Component {
  static propTypes = {
    member: PropTypes.object.isRequired,
    onVoteHover: PropTypes.func,
    agency: PropTypes.object
  }
  state = {
    activeVote: null
  }
  _votes() {
    const { agency, member, onVoteHover, activeVote } = this.props
    const { votes } = agency
    return <div className="votes">
      {(votes || []).map((v, i) => {
        const memberVote = v.member_votes[member.ref]
        return <Link
            to={`/${agency.abbreviation.toLowerCase()}/${v.id}`}
            className={classNames('vote', memberVote, {
              bad: memberVote !== v.preferred_vote,
              good: memberVote === v.preferred_vote,
              active: activeVote === v.id
            })} 
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
    const { activeVote, agency } = this.props
    const { votes } = agency
    let voteTitle
    if (activeVote !== null) {
      const vote = find(propEq('id', activeVote), votes)
      voteTitle = <span>
        &nbsp;{vote.title}
        <small> (click for more info)</small>
      </span>
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
