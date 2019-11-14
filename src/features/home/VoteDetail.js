import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { agencySubtitle } from '../../common/lib';
import classNames from 'classnames'
import { propEq, find, mapObjIndexed } from 'ramda'

export default class VoteDetail extends Component {
  static propTypes = {
    agency: PropTypes.object,
    vote: PropTypes.object
  }

  render() {
    const { agency, vote } = this.props
    console.log(vote);
    const outcomeGood = (vote.preferred_vote === 'nay' && vote.outcome === 'fail') || (vote.preferred_vote === 'yea' && vote.outcome === 'pass')
    return (
      <div className="home-vote-detail">
          <h3 className="agency">{agency.agency} <span>({agency.abbreviation})</span></h3>
          {agencySubtitle(agency)}
          <h3 className="key">
            Record on Key Votes:
            &nbsp;<span>{vote.title}</span>
          </h3>
          <div className="sub">
            <span>{vote.vote_date}</span>
            {vote.link ? <a target="_blank" href={vote.link}>Link to full text</a> : null}
          </div>
          {vote.long_title ? <p><i>{vote.long_title}</i></p> : null}
          <div className="body" dangerouslySetInnerHTML={{ __html: vote.description }}></div>
          <div className="position">
            <div className="good">
              Our Postion: 
              <div className="block" />
              {vote.preferred_vote}
            </div>
            <div className={outcomeGood ? 'good' : 'bad'}>
              Outcome: 
              <div className="block" />
              {vote.outcome}
            </div>
          </div>
          <div className="why" dangerouslySetInnerHTML={{ __html: vote.why }}></div>
          <div className="votes">
            <h4>Votes:</h4>
            {Object.values(mapObjIndexed((v, memberId) => {
              return <div className={classNames('vote', v, {
                good: v === vote.preferred_vote,
                bad: v !== vote.preferred_vote
              })} key={memberId}>
                  <span>{find(propEq('ref', memberId), agency.members).name}</span>
                  <div className="block"/>
                  <span>{v}</span>
                </div>
            }, vote.member_votes))}
          </div>
      </div>
    )
  }
}
