[%raw {|require('./About.scss')|}];

[@react.component]
let make = (~title: string, ~content: string, ~resumeUrl: string) =>
  <>
    <h2> {React.string(title)} </h2>
    <hr />
    <p> {React.string(content)} </p>
    <a> {React.string(resumeUrl)} </a>
  </>;