import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import reactLogo from '../../images/react-logo.svg';
import rekitLogo from '../../images/rekit-logo.svg';
import * as actions from './redux/actions';
import bindAllActions from '../common/redux/bindAllActions'
import {
  Agency
} from './'

class DefaultPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    const { agencies } = this.props.home
    return (
      <div className="home-default-page">
        {agencies.map(a => <Agency agency={a} key={a.abbreviation} />)}
      </div>
    );
  }
}

export default bindAllActions(DefaultPage)