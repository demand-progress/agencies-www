import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import bindAllActions from '../common/redux/bindAllActions'
import {
  Agency
} from './'
import {
  WpContent
} from '../common'
import { propEq, flatten, pluck } from 'ramda'

class DefaultPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    const { agencies } = this.props.home
    const members = flatten(pluck('members', agencies))
    const getStatus = status => {
      return members.filter(propEq('term status', status))
    }
    let agShow
    const vacants = getStatus('Vacant')
    const expireds = getStatus('Expired')
    if (agencies.length > 0) {
      agShow = <div className="agencies">
        <div className="wrap">
          <WpContent id={40} />
          <div className="stats">
            <div className="stat">
              <div className="num">{vacants.length}</div>
              <h3>VACANT SEATS</h3>
              <div className="party">
                <span className="dem">{vacants.filter(propEq('political party', 'Democrat')).length} Democrat,</span>
                <span className="rep"> {vacants.filter(propEq('political party', 'Republican')).length} Republican,</span>
                <span className="np"><br/>{vacants.filter(propEq('political party', 'N/A')).length} Non Partisan</span>
              </div>
            </div>
            <div className="stat">
              <div className="num">{expireds.length}</div>
              <h3>EXPIRED SEATS</h3>
              <div className="party">
                <span className="dem">{expireds.filter(propEq('political party', 'Democrat')).length} Democrat,</span>
                <span className="rep"> {expireds.filter(propEq('political party', 'Republican')).length} Republican,</span>
                <span className="np"><br/>{expireds.filter(propEq('political party', 'N/A')).length} Non Partisan</span>
              </div>
            </div>
            <div className="stat">
              <div className="num">{getStatus('Pending').length}</div>
              <h3>PENDING<br/>NOMINATIONS</h3>
            </div>
          </div>
          {agencies.map(a => <Agency agency={a} key={a.abbreviation} />)}
        </div>
      </div>

    }
    return (
      <div className="home-default-page">
        <div className="wrap">
          <WpContent id={2} />
        </div>
        {agShow}
      </div>
    );
  }
}

export default bindAllActions(DefaultPage)