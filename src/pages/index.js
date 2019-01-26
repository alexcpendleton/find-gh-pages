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
        <SEO title="" keywords={['find', 'gh-pages', 'github pages']} />
        <main role="main">
          <section>
            <form className="form">
              <fieldset>
                <div className="form-row">
                  <label className="username-label" htmlFor="username">
                    Your Username
                  </label>
                  <input
                    name="username"
                    id="username"
                    type="text"
                    onChange={this.handleUsernameChange}
                    className="username-input"
                  />
                  <button
                    type="submit"
                    onClick={this.handleFindClick}
                    className="find-button"
                  >
                    Find Them
                  </button>
                </div>
              </fieldset>
            </form>
            <Results {...this.state} />
          </section>
        </main>
        <footer className="footer">
          <p className="icon-attribution">
            Icon created by Gan Khoon Layc of the Noun Project
          </p>
          <p>
            <a href="https://www.github.com/alexcpendleton/find-gh-pages">
              Source code available on Github
            </a>
          </p>
        </footer>
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
      return <div className="output loading">Searching...</div>
    }
    if (hasSearched && results.length === 0) {
      return (
        <div className="output empty-results">
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
          Pages
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
          Repository
        </a>
      ) : (
        ''
      )
      return (
        <li className="repo" key={i.repoLink}>
          <h2 className="repo-name">{i.name}</h2>
          {pagesLink}
          {repoLink}
        </li>
      )
    })

    return <ul className="output repos">{items}</ul>
  }
}

export default IndexPage
