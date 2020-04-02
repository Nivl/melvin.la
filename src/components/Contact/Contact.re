[%raw {|require('./Contact.scss')|}];

[@react.component]
let make = (~email, ~linkedInHandle, ~githubHandle) =>
  <>
    {React.string(email)}
    {React.string(linkedInHandle)}
    {React.string(githubHandle)}
  </>;