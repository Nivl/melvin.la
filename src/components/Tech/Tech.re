[%raw {|require('./Tech.scss')|}];

[@react.component]
let make =
    (
      ~title: string,
      ~content: list(string),
      ~logos: list(Db.techLogo),
      ~inverted=false,
    ) =>
  <div className={"tech" ++ (inverted ? " inverted" : "")}>
    <div className="logos">
      {React.array(
         Array.of_list(
           logos
           |> List.map((logo: Db.techLogo) =>
                <a
                  key={logo.name}
                  href={logo.url}
                  className="tech-logo simplified-svg-logo">
                  <Logo name={logo.img} />
                </a>
              ),
         ),
       )}
    </div>
    <div className="tech-content">
      <h2> {React.string(title)} </h2>
      {React.array(
         Array.of_list(
           content |> List.map((c: string) => <p> {React.string(c)} </p>),
         ),
       )}
    </div>
  </div>;