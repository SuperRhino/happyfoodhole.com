import React from 'react';

export default class BlogSearch extends React.Component {
  static propTypes = {
    term: React.PropTypes.string,
  };
  static defaultProps = {
    term: null,
  };

  constructor(props) {
    super(props);

    this.state = {};

    this._onSubmit = this._onSubmit.bind(this);
  }

  render() {
    return (
      <div className="well">
          <h4>Blog Search</h4>
          <form role="form" onSubmit={this._onSubmit}>
            <div className="input-group">
              <input ref="searchTerm" type="text" className="form-control" defaultValue={this.props.term} />
              <span className="input-group-btn">
                <button className="btn btn-default" type="submit">
                  <span className="glyphicon glyphicon-search"></span>
                </button>
              </span>
            </div>
          </form>
      </div>
    );
  }

  _onSubmit(e) {
    e.preventDefault();
    if (this.refs.searchTerm.value) {
      window.location = "/search?term="+this.refs.searchTerm.value
    }
  }
}