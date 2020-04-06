[%raw {|require('./Header.scss')|}];

[@react.component]
let make = () =>
  <header>
    <h1>
      <span className="simplified-svg-logo"> <MelvinLogo /> </span>
      <div className="title-text">
        <span className="text-accent"> {React.string("MELVIN ")} </span>
        <span> {React.string("LAPLANCHE")} </span>
      </div>
    </h1>
    <div className="subtitle">
      {React.string("FULL STACK ENGINEER BUILDING COOL STUFF AT ")}
      <a href="www.abstract.com"> {React.string("ABSTRACT")} </a>
    </div>
  </header>;