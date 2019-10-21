import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getApiUrl } from '../../common/lib';

export default class WpContent extends Component {
  static propTypes = {
    id: PropTypes.number
  }
  state = {

  }
  componentDidMount() {
    if (this.props.id) {
      fetch(getApiUrl() + '/wp-json/wp/v2/pages/' + this.props.id)
        .then(res => res.json())
        .then(res => {
          this.setState({
            content: res.content.rendered
          })
        })
    }
  }

  render() {
    const { id } = this.props
    const { content } = this.state
    return (
      <div className="common-wp-content" id={'content_' + id} dangerouslySetInnerHTML={{ __html: content }}>
      </div>
    );
  }
}
