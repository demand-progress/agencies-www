import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from './redux/actions';
import bindAllActions from '../common/redux/bindAllActions'
import {
  Agency
} from './'
import {
  WpContent
} from '../common'

class DefaultPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    const { agencies } = this.props.home
    return (
      <div className="home-default-page">
        <WpContent id={2} />
        <div className="agencies">
          {agencies.map(a => <Agency agency={a} key={a.abbreviation} />)}
        </div>
      </div>
    );
  }
}

export default bindAllActions(DefaultPage)