[%raw {|require('./About.scss')|}];

[@react.component]
let make =
    (
      ~title: string,
      ~content: string,
      ~resumeUrl: string,
      ~pictureUrl: string,
    ) =>
  <div id="about">
    <div className="about-content">
      <h2> {React.string(title)} </h2>
      <p> {React.string(content)} </p>
      <a href=resumeUrl className="resume">
        <div className="simplified-svg-logo"> <AngleRightIcon /> </div>
        {React.string("Download my Resume")}
      </a>
    </div>
    <div className="picture"> <img src=pictureUrl alt="me" /> </div>
  </div>;