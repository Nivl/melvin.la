[%raw {|require('./About.scss')|}];

[@react.component]
let make = (~title: string, ~content: string, ~resumeUrl: string) =>
  <div className="about">
    <h2> {React.string(title)} </h2>
    <p> {React.string(content)} </p>
    <a> {React.string(resumeUrl)} </a>
  </div>;