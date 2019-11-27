import React, { Component } from 'react';
import { getApiUrl } from '../../common/lib'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { path, find, propEq } from 'ramda'

export default class WpPostsList extends Component {
  static propTypes = {

  }
  state = {
    posts: [],
    tags: []
  }
  componentDidMount() {
    fetch(getApiUrl() + '/wp-json/wp/v2/posts/?per_page=100')
      .then(res => res.json())
      .then(posts => {
        console.log(posts);
        this.setState({
          posts
        })
      })
    fetch(getApiUrl() + '/wp-json/wp/v2/tags/?per_page=100')
      .then(res => res.json())
      .then(tags => {
        console.log(tags);
        this.setState({
          tags 
        })
      })
  }

  render() {
    const { posts, tags } = this.state
    return (
      <div className="common-wp-posts-list">
        {posts.map(p => {
          let readMore
          const extLink = path(['acf', 'external_link'], p)
          if (extLink) {
            readMore = <div className="fr"><a href={extLink} target="_blank" className="btn">Read Full Post</a></div>
          }
          return <div key={p.id} className="post">
              <div className="meta">
                <ul className="tags comma-list">
                  {p.tags.map(tagId => {
                    const tag = find(propEq('id', tagId), tags)
                    if (tag) {
                      return <li key={p.id + tagId}><Link to={`/${tag.name.toLowerCase()}?s=${tag.name.toLowerCase()}`}>{tag.name}</Link></li>
                    }
                    return null
                  })}
                </ul>
                <div className="date">{moment(p.date).format('M.D.YY')}</div>
              </div>
              <h2>{p.title.rendered}</h2>
              <div className="content" dangerouslySetInnerHTML={{ __html: p.content.rendered }}></div>
              {readMore}
            </div>
        })}
      </div>
    );
  }
}
