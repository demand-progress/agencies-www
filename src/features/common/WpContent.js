import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getApiUrl } from '../../common/lib';

export default class WpContent extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    showTitle: PropTypes.bool
  }
  state = {

  }
  componentDidMount() {
    if (this.props.id) {
      fetch(getApiUrl() + '/wp-json/wp/v2/pages/' + this.props.id)
        .then(res => res.json())
        .then(res => {
          this.setState({
            content: res.content.rendered,
            title: res.title.rendered
          })
        })
    }
  }

  render() {
    const { id, showTitle } = this.props
    const { content, title } = this.state
    return (
      <div className="common-wp-content" id={'content_' + id}>
        {showTitle ? <h1>{title}</h1> : null}
        <div className="content" dangerouslySetInnerHTML={{ __html: content }}></div>
      </div>
    )
  }
}
