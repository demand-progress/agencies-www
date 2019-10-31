import React, { Component } from 'react';
import { getApiUrl } from '../../common/lib'

export default class WpPostsList extends Component {
  static propTypes = {

  }
  state = {
    posts: []
  }
  componentDidMount() {
    fetch(getApiUrl() + '/wp-json/wp/v2/posts/')
      .then(res => res.json())
      .then(posts => {
        console.log(posts);
        this.setState({
          posts
        })
      })
  }

  render() {
    const { posts } = this.state
    return (
      <div className="common-wp-posts-list">
        {posts.map(p => {
          return <div key={p.id} className="post">
              <h2>{p.title.rendered}</h2>
              <div className="content" dangerouslySetInnerHTML={{ __html: p.content.rendered }}></div>
            </div>
        })}
      </div>
    );
  }
}
