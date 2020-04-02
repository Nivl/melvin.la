[%raw {|require('./App.scss')|}];

[@bs.module] external logo: string = "./logo.svg";

[@react.component]
let make = () =>
  <>
    <Section> <Header /> </Section>
    <Section> <About /> </Section>
    <Section> <Tech /> </Section>
    <Section> <Tech /> </Section>
    <Section> <Contact /> </Section>
    <Section> <Footer /> </Section>
  </>;