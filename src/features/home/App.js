import React, { Component } from 'react';
import PropTypes from 'prop-types';
import bindAllActions from '../common/redux/bindAllActions'
import { withRouter, Link } from 'react-router-dom'
import { VOTE_AGENCIES, getApiUrl } from '../../common/lib';
import { find, propEq, join, pluck } from 'ramda'
import moment from 'moment'
import classNames from 'classnames'
/*
  This is the root component of your app. Here you define the overall layout
  and the container of the react router.
  You should adjust it according to the requirement of your app.
*/
class App extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: '',
  };

  componentDidMount() {
    const { actions, location } = this.props
    actions.fetchSheets(location.search)
      .then(agencies => {
        VOTE_AGENCIES.forEach(abbr => {
          const agency = find(propEq('abbreviation', abbr), agencies)
          fetch(getApiUrl() + '/?members=' + join(',', pluck('ref', agency.members)))
            .then(res => res.json())
            .then(votes => {
              actions.setAgencyProp(agency.abbreviation, 'votes', votes.sort((a,b) => {
                return moment(a.vote_date, 'M/D/YYYY').valueOf() - moment(b.vote_date, 'M/D/YYYY').valueOf()
              }))
            })
        })
      })
  }

  render() {
    const { location } = this.props
    return (
      <div className="home-app">
        <nav id="main_nav">
          <Link to="/" className="logo">
          </Link>
          <ul>
            <li><Link className={classNames({ active: location.pathname === '/' })} to="/">Tracker</Link></li>
            <li><Link className={classNames({ active: location.pathname === '/news' })} to="/news">News</Link></li>
            <li><Link className={classNames({ active: location.pathname === '/about' })} to="/about">About</Link></li>
          </ul>
        </nav>
        <div className="page-container">{this.props.children}</div>
      </div>
    );
  }
}

export default withRouter(bindAllActions(App))