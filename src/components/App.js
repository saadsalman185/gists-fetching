import "../components/App.css";
import React, { Component } from "react";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      gists: false,
      forkData: [],
      fileText: [],
      showData: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.forkBack = this.forkBack.bind(this);
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ forkData: [] });
    const res = await fetch(
      `https://api.github.com/users/${this.state.username}/gists`
    );
    const resJson = await res.json();
    this.setState({ gists: resJson });
  }

  handleChange(event) {
    const { value } = event.target;
    this.setState({
      username: value,
      gists: false,
    });
  }

  getForks = (url, forkBack) => {
    fetch(url)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.length > 0) {
          forkBack(resJson);
        }
      });
  };

  forkBack(resp) {
    console.log("aaaaa", resp);
    if (resp.length) {
      if (resp.length === 1) {
        const joined = this.state.forkData.concat({ f1: resp[0].owner.login });
        this.setState({ forkData: joined });
      } else if (resp.length === 2) {
        const joined = this.state.forkData.concat({
          f1: resp[1].owner.login,
          f2: resp[0].owner.login,
        });
        this.setState({ forkData: joined });
      } else {
        const joined = this.state.forkData.concat({
          f1: resp[resp.length - 1].owner.login,
          f2: resp[resp.length - 2].owner.login,
          f3: resp[resp.length - 3].owner.login,
        });
        this.setState({ forkData: joined });
      }
    } else {
      const joined = this.state.forkData.concat({ f1: "No Forks" });
      this.setState({ forkData: joined });
    }
  }

  getFileData(url, callBack) {
    console.log("url", url);
    fetch(url)
      .then((res) => res.text())
      .then((data) => {
        callBack(data);
      });
  }

  callBack = (resp) => {
    console.log("abc", resp);
    const joined = this.state.fileText.concat(resp);
    this.setState({ fileText: joined });
  };

  displayData = () => {
    console.log("test");
    this.setState({ showData: !this.state.showData });
  };
  renderGists = () => {
    const { gists, fileText, forkData } = this.state;
    let count = 0;
    const gistsData = gists.map((gist) => {
      const fileNames = Object.keys(gist.files);
      const fileData = Object.values(gist.files);
      this.getForks(gist.forks_url, this.forkBack);
      return (
        <div>
          <h3>GIST: {gist.description}</h3>
          <p>
            <b>Fork1:</b> {forkData[count]?.f1 ?? "No fork available"}
          </p>
          <p>
            <b>Fork2:</b> {forkData[count]?.f2 ?? "No fork available"}
          </p>
          <p>
            <b>Fork3:</b> {forkData[count]?.f3 ?? "No fork available"}
          </p>
          {fileNames.map((file, index) => {
            {
              this.getFileData(fileData[index].raw_url, this.callBack);
            }
            return (
              <div>
                <p>
                  <b>File Name: </b> {file}
                </p>

                <p>
                  {" "}
                  <b>TAG: </b>
                  {fileData[index].language ?? "Null type"}
                </p>
                <p>
                  <b>File Data</b> {fileText[count]}
                </p>
                {(count += 1)}
              </div>
            );
          })}
        </div>
      );
    });
    return gistsData;
  };

  render() {
    const { gists, username } = this.state;
    return (
      <div className="App">
        <form onSubmit={this.handleSubmit} className="form">
          <p>Enter Username:</p>
          <input
            type="text"
            placeholder="Username..."
            name="username"
            value={username}
            onChange={this.handleChange}
          />
          <br />

          <button>Get Gists</button>
        </form>
        {gists.length >= 0 && <p>{gists.length} Gists found!</p>}
        {gists.length > 0 && <p>{username} has following Gists:</p>}
        <div className="listWrapper">
          {gists.length > 0 ? this.renderGists() : null}
        </div>
      </div>
    );
  }
}
