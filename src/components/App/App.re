[%raw {|require('./App.scss')|}];

let dbRaw = {| {
  "pages": {
    "about": {
      "title": "About Me",
      "content": "With about 8 years of professional experience and 15 years of personal experience (that's more than half of my life!), I have been playing with many different technologies. I love to learn new things, and I never take any of my knowledge for granted (everything is evolving too fast to assume we still know how to do a specific task after a couple of years). I have a passion for clean architecture and well-tested code. People assume 100% code coverage is a waste of time, to me it's a way to make sure your code is flexible and more future proof.",
      "resumeUrl": "https://github.com/Nivl/resume/raw/master/cv-melvin-laplanche.pdf",
      "pictureUrl": "/images/melvin.jpg"
    },
    "contact": {
      "email": "jobs@melvin.la",
      "linkedInHandle": "melvinlaplanche",
      "githubHandle": "Nivl"
    },
    "backendOps": {
      "title": "Backend / Ops technologies",
      "content": "Like many people, backend is the very first \"real\" thing I started learning (I don't count HTML/CSS since they are not programing language). I started with raw PHP back when it was still the hot tech to build websites, then jumped on the new trends: Rails, Django, Symfony 2, Node, Go, etc (the list on the left doesn't contain all the tech I used, but only the one I liked the most and/or used the most). I usually try to keep myself up to date with the evolution of the backend techs while trying to understand all the pros and cons before taking a decision of moving forward with them (instead of blindly following the trend).",
      "logos": [
        { "img":"go", "name":"Go", "url":"https://golang.org" },
        { "img":"grpc", "name":"gRPC", "url":"https://grpc.io" },
        { "img":"nodejs", "name":"NodeJS", "url":"https://nodejs.org" },
        { "img":"django", "name":"Django", "url":"https://djangoproject.com" },
        { "img":"python", "name":"Python", "url":"https://python.org" },
        { "img":"postgres", "name":"Postgres", "url":"https://postgresql.org" },
        { "img":"mysql", "name":"MySQL", "url":"https://mysql.com" },
        { "img":"mongodb", "name":"MongoDB", "url":"https://mongodb.com" },
        { "img":"redis", "name":"Redis", "url":"https://redis.io" },
        { "img":"elasticSearch", "name":"ElasticSearch", "url":"https://www.elastic.co/products/elasticsearch" },
        { "img":"googleCloud", "name":"Google Cloud", "url":"https://cloud.google.com/products/#cloud-computing" },
        { "img":"heroku", "name":"Heroku", "url":"https://heroku.com/" },
        { "img":"aws", "name":"AWS", "url":"https://aws.amazon.com/" },
        { "img":"docker", "name":"Docker", "url":"https://docker.com" }
      ]
    },
    "clientTech": {
      "title": "CLIENT (WEB, MOBILE, DESKTOP, etc.) TECHNOLOGIES",
      "content": "Backend is fun, but nowadays a backend doesn't do much beside treating data and returning more data to the clients. So naturally, I got interested in learning the client side of the stack. I'm convinced that writing client code made me a better backend engineer as I know the pain and struggle of dealing with undocumented APIs, or badly implemented APIs that partially return the data you need (you know, those APIs made by backend engineers that know better than you what data you need). I professionally touched a bit of everything: native mobile apps (iOS and Android), hybrid mobile apps, regular Electron apps, Electron apps with a Go backend to do all the heavy lifting (with some cgo to use native Windows and macOS libraries), SPAs using angular, etc.",
      "logos": [
        { "img":"android", "name":"Android", "url":"https://android.com" },
        { "img":"apple", "name":"MacOS / iOS", "url":"https://developer.apple.com" },
        { "img":"electron", "name":"Electron", "url":"https://electronjs.org" },
        { "img":"c", "name":"C", "url":"https://www.wikiwand.com/en/C_(programming_language)" },
        { "img":"cpp", "name":"C++", "url":"https://www.wikiwand.com/en/C%2B%2B" },
        { "img":"javascript", "name":"JavaScript", "url":"https://www.wikiwand.com/en/JavaScript" },
        { "img":"typescript", "name":"Typescript", "url":"https://www.typescriptlang.org" },
        { "img":"reasonml", "name":"Reasonml", "url":"https://reasonml.github.io" },
        { "img":"angular", "name":"Angular", "url":"https://angular.io" },
        { "img":"reactjs", "name":"ReactJS", "url":"https://reactjs.org" },
        { "img":"java", "name":"Java", "url":"https://java.com" },
        { "img":"swift", "name":"Swift", "url":"https://swift.org" },
        { "img":"git", "name":"Git internal", "url":"https://git-scm.com/book/en/v2" }
      ]
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
        pictureUrl={db.pages.about.pictureUrl}
      />
    </Section>
    <Section>
      <Tech
        title={db.pages.backendOps.title}
        content={db.pages.backendOps.content}
        logos={db.pages.backendOps.logos}
      />
    </Section>
    <Section>
      <Tech
        title={db.pages.clientTech.title}
        content={db.pages.clientTech.content}
        logos={db.pages.clientTech.logos}
      />
    </Section>
    <Section>
      <Contact
        email={db.pages.contact.email}
        linkedInHandle={db.pages.contact.linkedInHandle}
        githubHandle={db.pages.contact.githubHandle}
      />
    </Section>
    <Section> <Footer /> </Section>
  </>;