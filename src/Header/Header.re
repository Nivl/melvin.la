[@bs.module] external logo: string = "./logo.png";

[@react.component]
let make = () =>
  <header>
    <img src=logo alt="logo" />
    <h1> {React.string("MELVIN LAPLANCHE")} </h1>
    <div>
      {React.string("FULL STACK ENGINEER BUILDING COOL STUFF AT ")}
      <a href="www.abstract.com"> {React.string("ABSTRACT")} </a>
    </div>
  </header>;