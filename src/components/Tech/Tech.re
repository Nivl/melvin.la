[%raw {|require('./Tech.scss')|}];

[@react.component]
let make = (~title: string, ~content: string, ~logos: list(Db.techLogo)) =>
  <div className="tech">
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
      <p> {React.string(content)} </p>
    </div>
  </div>;