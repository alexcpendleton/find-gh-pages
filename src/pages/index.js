import React from 'react'

import Layout from '../components/layout'
import SEO from '../components/seo'

class IndexPage extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      results: [],
      isLoading: false,
      hasSearched: false,
      username: '',
    }
    this.handleFindClick = this.handleFindClick.bind(this)
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
  }
  render() {
    return (
      <Layout>
        <SEO title="Home" keywords={['find', 'gh-pages', 'github pages']} />
        <main role="main">
          <section>
            <form>
              <label>
                Your Username
                <input type="text" onChange={this.handleUsernameChange} />
              </label>
              <button type="submit" onClick={this.handleFindClick}>
                Find Them
              </button>
              <Results {...this.state} />
            </form>
          </section>
        </main>
      </Layout>
    )
  }
  handleFindClick(event) {
    event.preventDefault()
    event.stopPropagation()
    const username = this.state.username
    this.triggerSearch(username)
  }
  async triggerSearch(username) {
    const uri = `https://api.github.com/users/${username}/repos`
    this.setState({ isLoading: true })
    const response = await fetch(uri)
    const json = await response.json()
    let results = []
    if (json && json.filter) {
      results = json
        .filter(repo => repo.has_pages)
        .map(repo => {
          const name = repo.name
          const pagesUri = `http://${username}.github.io/${name}/`
          const repoUri = repo.html_url
          return { name, pagesUri, repoUri }
        })
    }
    this.setState({
      isLoading: false,
      hasSearched: true,
      results,
    })
  }
  handleUsernameChange(event) {
    this.setState({ username: event.target.value })
  }
}

class Results extends React.Component {
  render() {
    const { results, isLoading, hasSearched } = { ...this.props }
    if (isLoading) {
      return <div className="loading">Searching...</div>
    }
    if (hasSearched && results.length === 0) {
      return (
        <div className="empty-results">
          No repositories with gh-pages were found. :(
        </div>
      )
    }
    const items = results.map(i => {
      const pagesLink = i.pagesUri ? (
        <a
          href={i.pagesUri}
          className="pages-uri"
          target="_blank"
          rel="noopener noreferrer"
        >
          {i.pagesUri}
        </a>
      ) : (
        ''
      )
      const repoLink = i.repoUri ? (
        <a
          href={i.repoUri}
          className="repo-uri"
          target="_blank"
          rel="noopener noreferrer"
        >
          {i.repoUri}
        </a>
      ) : (
        ''
      )
      return (
        <li className="repo" key={i.repoLink}>
          <span className="repo-name">{i.name}</span>
          {pagesLink}
          {repoLink}
        </li>
      )
    })

    return <ul className="repos">{items}</ul>
  }
}

export default IndexPage
