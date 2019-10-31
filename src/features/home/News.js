import React, { Component } from 'react';
import {
  WpPostsList
} from '../common'

export default class News extends Component {
  static propTypes = {

  };

  render() {
    return (
      <div className="home-news">
        <h1>News</h1>
        <WpPostsList />
      </div>
    );
  }
}
