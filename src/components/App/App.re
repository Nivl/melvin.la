[%raw {|require('./App.scss')|}];

let dbRaw = {| {
  "pages": {
    "about": {
      "title": "About Me",
      "content": "With about 8 years of professional experience and 15 years of personal experience (that's more than half of my life!), I have been playing with many different technologies. I love to learn new things, and I never take any of my knowledge for granted (everything is evolving too fast to assume we still know how to do a specific task after a couple of years). I have a passion for clean architecture and well-tested code. People assume 100% code coverage is a waste of time, to me it's a way to make sure your code is flexible and more future proof.",
      "resumeUrl": "https://github.com/Nivl/resume/raw/master/cv-melvin-laplanche.pdf"
    },
    "contact": {
      "email": "jobs@melvin.la",
      "linkedInHandle": "melvinlaplanche",
      "githubHandle": "Nivl"
    }
  }
} |};

let db: Db.db = dbRaw |> Json.parseOrRaise |> Db.Decode.db;

[@react.component]
let make = () =>
  <>
    <Section> <Header /> </Section>
    <Section>
      <About
        title={db.pages.about.title}
        content={db.pages.about.content}
        resumeUrl={db.pages.about.resumeUrl}
      />
    </Section>
    <Section> <Tech /> </Section>
    <Section> <Tech /> </Section>
    <Section>
      <Contact
        email={db.pages.contact.email}
        linkedInHandle={db.pages.contact.linkedInHandle}
        githubHandle={db.pages.contact.githubHandle}
      />
    </Section>
    <Section> <Footer /> </Section>
  </>;