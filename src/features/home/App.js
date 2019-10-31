import React, { Component } from 'react';
import PropTypes from 'prop-types';
import bindAllActions from '../common/redux/bindAllActions'
import { Link } from 'react-router-dom'
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
    const { actions } = this.props
    actions.fetchSheets()
  }

  render() {
    return (
      <div className="home-app">
        <nav id="main_nav">
          <Link to="/">
            <img src="http://placekitten.com/400/80"/>
          </Link>
          <ul>
            <li><Link to="/">Tracker</Link></li>
            <li><Link to="/why">Why?</Link></li>
            <li><Link to="/news">News</Link></li>
            <li><a href="https://demandprogress.org">Take Action</a></li>
          </ul>
        </nav>
        <div className="page-container">{this.props.children}</div>
      </div>
    );
  }
}

export default bindAllActions(App)