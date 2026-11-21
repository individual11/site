/**
 * Portfolio projects. Display order is array order: move an entry to reorder.
 * `featured: true` gets a full scroll section with its own particle formation;
 * the rest show in the smaller "More work" list.
 *
 * `media` paths point into the original archive (../_individual11) for now.
 * They get compressed and copied into /public when the portfolio page is built.
 * Anything marked TODO still needs David's confirmation.
 */

export type Project = {
  slug: string;
  title: string;
  client?: string;
  year: string;
  role?: string;
  /** One line, shown on cards and in the scroll section. */
  summary: string;
  /** Short paragraphs for the project's detail view. */
  body: string[];
  /** Hard numbers worth calling out. */
  stats?: { value: string; label: string }[];
  tech?: string[];
  awards?: string[];
  links?: { label: string; href: string }[];
  media: { src: string; kind: "image" | "video"; note?: string }[];
  featured: boolean;
  todo?: string[];
};

export const PROJECTS: Project[] = [
  {
    slug: "donate-life",
    title: "The World's Biggest Asshole",
    client: "Donate Life",
    year: "2016",
    role: "Copywriter / ACD, The Martin Agency",
    summary: "Even the worst guy you've ever met can still save a life.",
    body: [
      "A campaign to get younger people onto the organ donor registry. Heartstrings don't work on skeptics, so we gave them Coleman Sweeney, an asshole every day of the year except for the one moment he did something good. The mural made the same point to anyone walking by: even this guy can save a life.",
      "It was seen more than 80 million times in 76 countries, and daily donor registrations went up roughly 700% in the two weeks after launch.",
      "I was one of the writers, and ACD on it at The Martin Agency.",
    ],
    stats: [
      { value: "80M+", label: "views in 76 countries" },
      { value: "~700%", label: "jump in daily donor registrations" },
      { value: "10", label: "Cannes Lions" },
    ],
    awards: [
      "Cannes Lions 2017: 3 Gold, 2 Silver, 5 Bronze",
      "One Show 2017: 2 Gold Pencils, plus Silver Pencils",
      "D&AD 2017: Yellow Pencil, 2 Graphite, 3 Wood",
      "Clio Awards 2017: Gold",
      "shots Awards 2016: Charity/PSA Campaign of the Year",
    ],
    links: [{ label: "registerme.org", href: "https://registerme.org" }],
    media: [
      { src: "World's Biggest Asshole_Donate Life.mov", kind: "video", note: "Full film, 2:47, 1080p" },
      { src: "Donate Life ONE SHOW 2016.mov", kind: "video", note: "Case video, 2:00, 1080p" },
      { src: "Donate Life SHOW 2017 Case edit 04c.mov", kind: "video", note: "2017 case video, 2:00, 540p" },
      { src: "Donate Life Mural_Cropped.4VH5d copy (1).jpg", kind: "image", note: "Mural" },
    ],
    featured: true,
  },
  {
    slug: "find-new-roads",
    title: "Find New Roads",
    client: "Chevrolet",
    year: "2016",
    role: "ACD / Copywriter",
    summary: "A gas pump that read your social posts and paid you in gallons.",
    body: [
      "We swapped the card readers on gas pumps for tablets where you could put in your social media. IBM Watson read your posts, and the more positive you were, the more free gas you got.",
      "The receipt came with adventure ideas nearby. The most positive people got something bigger, like fan boating in New Orleans or a private meal in Argentina.",
      "We ran the stunt in New Orleans, Argentina, Dubai, Delhi, South Korea, Cape Town and Canada, handed out thousands of gallons, and the videos were seen by millions.",
      "I was ACD and copywriter on it.",
    ],
    stats: [
      { value: "7", label: "countries" },
      { value: "1000s", label: "of free gallons" },
    ],
    tech: ["IBM Watson"],
    media: [{ src: "Chevy Pump Case Short edit 04_1.mp4", kind: "video", note: "Case video, 2:00, 1080p" }],
    featured: true,
  },
  {
    slug: "buddy",
    title: "Buddy",
    client: "Buddy",
    year: "2017-2026",
    role: "Co-founder / CTO",
    summary: "An insurance platform that sells eight figures of premium a year and needs nobody to babysit it.",
    body: [
      "I co-founded Buddy and ran technology. That meant building the team, the platform, and ION (Insurance Object Notation), a data format that turns an insurance product's rules, pricing and workflows into something you can deploy anywhere.",
      "It sells and services insurance in all 50 states, across the whole life of a policy, for carriers including Allstate, WR Berkley, Great American and Chubb. Eight figures in annual premium, tens of thousands of policies a year, at 99.9999% uptime with no humans in the loop.",
      "New channels stop being engineering projects. A product the industry takes six-plus months to launch goes live in days (the fastest was 18 hours), and one ION definition reaches direct, embedded, agent, Stripe and AI-agent channels.",
      "The whole platform, database included, runs on under $2,500 a month of AWS. That was an architecture decision, not a coupon.",
    ],
    stats: [
      { value: "99.9999%", label: "uptime" },
      { value: "0", label: "humans in the loop" },
      { value: "8 figures", label: "written premium a year" },
      { value: "18 hrs", label: "fastest product launch" },
      { value: "<$2.5k", label: "a month of AWS for everything" },
    ],
    tech: ["ION", "Embedded checkout", "MCP server"],
    links: [{ label: "buddy.insure", href: "https://buddy.insure" }],
    media: [
      { src: "https://buddy.insure/images/buddy-wordmark.svg", kind: "image", note: "Wordmark" },
      { src: "https://buddy.insure/images/code-snippet.png", kind: "image", note: "The eight-line embed" },
      { src: "diagram:one-definition-five-channels", kind: "image", note: "To draw: one product definition fanning out to direct, embedded, agent, Stripe and AI-agent channels. ION itself stays private." },
    ],
    featured: true,
  },
  {
    slug: "microsoft-store",
    title: "Microsoft Store",
    client: "Microsoft",
    year: "2009",
    role: "Creative Director / Technical Lead, The Martin Agency",
    summary: "Content for a video wall that was, at launch, the highest-resolution screen in the world.",
    body: [
      "I consulted on a lot of the store, but my main job was the video wall that wraps around the whole room: working with vendors and the Microsoft team to get content and interactive pieces onto it.",
      "At the first store in Scottsdale the wall was 57,600 x 1,080 pixels. Every minute of content was the equivalent of 30 minutes of Blu-ray, and we launched with nearly an hour of it.",
    ],
    stats: [
      { value: "57,600 x 1,080", label: "pixel video wall" },
      { value: "~1 hr", label: "of launch content" },
    ],
    media: [
      { src: "work/MS/newPics/_IMG_5307_2.jpg", kind: "image", note: "Launch day, 2808x1872" },
      { src: "work/MS/newPics", kind: "image", note: "7 launch photos" },
      { src: "work/MS/31514197.mov", kind: "video", note: "1:26" },
    ],
    featured: true,
  },
  {
    slug: "light-of-human-kindness",
    title: "Light of Human Kindness",
    year: "2013",
    client: "RVA Street Art Festival",
    role: "With Patience Salgado, Hamilton Glass and the Martin Lab",
    summary: "A thousand lights on a mural. Some only came on if strangers held hands.",
    body: [
      "The wall was the old GRTC bus depot on Cary Street in Richmond. Patience Salgado led the project, and a group of artists and technologists covered the building in words of kindness from people's lives, then Hamilton Glass painted a mural over the top while leaving a lot of the words showing. The last layer was 1,000 high-output LED pods, run by two experimental light controllers and one computer.",
      "Online, you could claim a light by sharing an act of kindness someone did for you, and your pod lit up in real time.",
      "At the wall, we put conductive paint spots into the mural. Touch two at once and the lights animate. Most spots were too far apart for one person, so to see the better patterns you had to link hands with strangers.",
    ],
    stats: [{ value: "1,000", label: "LED pods" }],
    tech: ["Processing", "Conductive paint", "LED controllers"],
    links: [{ label: "RVA News", href: "https://rvanews.com/?p=100563" }],
    media: [
      { src: "work/lohk/LOHK_YouTube_V4_720p.mp4", kind: "video", note: "2:54, 720p" },
      { src: "work/lohk/at_the_wall", kind: "image", note: "8 wall photos, 3264x2448" },
      { src: "work/lohk/testing_the_lights", kind: "image", note: "6 build photos" },
    ],
    featured: true,
  },
  {
    slug: "flipdots",
    title: "FlipDots",
    client: "Martin Lab",
    year: "2012-2014",
    summary: "We inherited a giant flip-dot board, so I built the tools to make it do things.",
    body: [
      "I started the Martin Lab, the agency's emerging-tech unit. One of the first things we found was a leftover prop from a BFGoodrich shoot sitting in our basement: a 50 x 28 flip-dot board. We rebuilt it from the ground up and turned it into a creative tool.",
      "Ruby drives the board over serial. A Node web controller queues up animations. Dots Maker, a desktop app, lets you draw and animate frames with onion skinning and a shape library (space invaders included). There's also multiplayer Pong you play from your phone.",
    ],
    tech: ["Ruby", "Node.js", "ActionScript / AIR", "Serial"],
    media: [
      { src: "work/FlipDots/IMG_1398.JPG", kind: "image", note: "Space invader on the board" },
      { src: "work/FlipDots/IMG_1187.JPG", kind: "image", note: "The Hackathon Continues" },
      { src: "work/FlipDots/IMG_8646.MOV", kind: "video", note: "Close-up of the dots flipping, 2:13" },
      { src: "work/FlipDots/IMG_0285.JPG", kind: "image", note: "Behind the scenes build" },
      { src: "__LAB__/__ARTICLES__/screengrabs_for_lab_article", kind: "image", note: "Controller UI and Dots Maker screens" },
    ],
    featured: true,
  },
  {
    slug: "one-small-tweet",
    title: "One Small Tweet",
    client: "John F. Kennedy Presidential Library",
    year: "2012",
    summary: "Tweets that flew Neil Armstrong back to the moon one last time.",
    body: [
      "When Neil Armstrong died, the JFK Library wanted to let everyone he inspired take him back to the moon. Every memorial tweet moved the journey one step closer.",
      "People posted from all over the world, and 2,481 tweets later the rocket made it.",
    ],
    stats: [{ value: "2,481", label: "tweets to the moon" }],
    tech: ["PHP", "jQuery", "AWS", "Twitter API"],
    media: [
      { src: "Sites/oneSmallTweet/OneSmallTweet/images", kind: "image", note: "Moon, earth, stars, title lockup" },
      { src: "work/ost/screens.psd", kind: "image" },
    ],
    featured: true,
  },
  {
    slug: "cookie-blaster",
    title: "Cookie Blaster",
    year: "2013",
    summary: "A catapult that watches your face and fires a cookie when you open your mouth.",
    body: [
      "Designed in Tinkercad, 3D printed, and driven by an Arduino and a couple of servos. Processing and OpenCV on my laptop tracked faces, and when someone opened their mouth it launched a small cookie at it.",
      "It was a small video that got passed around a lot.",
    ],
    tech: ["Tinkercad", "3D printing", "Arduino", "Processing", "OpenCV"],
    media: [
      { src: "work/cookie blaster/cookie_blaster.mov", kind: "video", note: "1:23, 1080p" },
      { src: "work/cookie blaster/IMG_2012.JPG", kind: "image", note: "Arduino, servos and the 3D-printed launcher" },
      { src: "work/cookie blaster/IMG_2126.JPG", kind: "image", note: "Printed catapult arm" },
      { src: "work/cookie blaster", kind: "image", note: "9 build photos, Jul to Aug 2013" },
    ],
    featured: true,
  },

  // ---- More work ----
  {
    slug: "lorenz-attractor",
    title: "Lorenz Attractor",
    year: "2010",
    summary: "I can't draw freehand, so I made the code do it.",
    body: [
      "An early chaos algorithm I used for code-generated art. I built a tool in Processing to change the variables while it runs and export a vector PDF, and these prints came out of it.",
    ],
    tech: ["Processing"],
    media: [{ src: "work/lorenAttractor", kind: "image", note: "Blue and gray series, 610x1005" }],
    featured: false,
  },
  {
    slug: "birds",
    title: "Birds",
    year: "2010",
    role: "With Patrick Simkins",
    summary: "A flock that came for glow sticks and fled when the room got loud.",
    body: [
      "Prints and an installation for a Richmond gallery night, built around a digital flocking simulation. A webcam looked for glow sticks, which the birds treated like food. A mic listened to the room, and if it got too loud the birds got scared and flew off for a moment.",
    ],
    tech: ["Processing", "Computer vision"],
    links: [
      { label: "Test render", href: "http://vimeo.com/8058125" },
      { label: "Test render", href: "http://vimeo.com/9208841" },
    ],
    media: [
      { src: "work/birds/birds_24x36.png", kind: "image", note: "Poster, 3751x5550" },
      { src: "work/birds/birds_flyer.jpg", kind: "image" },
    ],
    featured: false,
  },
  {
    slug: "coffitivity",
    title: "Coffitivity for Mac",
    client: "Coffitivity",
    year: "2013",
    summary: "Coffee shop noise, in your menu bar.",
    body: [
      "Coffitivity plays coffee shop background noise to help you focus. Browsers aren't great at playing audio, so I built their first native Mac app. It lives in the menu bar, can launch at startup, and one click plays or stops it.",
      "It got written up in a few places and reached #11 overall in free apps.",
    ],
    stats: [{ value: "#11", label: "free apps overall" }],
    tech: ["Objective-C", "macOS"],
    media: [{ src: "work/Coffitivity/screen_1_full.png", kind: "image", note: "1907x1484" }],
    featured: false,
  },
  {
    slug: "my-story",
    title: "This Is My Story",
    client: "EF Education First",
    year: "2010",
    role: "Technical Lead",
    summary: "Upload a photo and watch the next 20 years of your life.",
    body: [
      "To show parents around the world what English could do for their kids, My Story turned one photo or webcam shot into a realistic film of a person's next 20 years.",
      "In just under a year, people made over 2.5 million videos. We used Amazon's cloud to scale it across a launch in 16 countries, and the films averaged 7.5 minutes of engagement each.",
    ],
    stats: [
      { value: "2.5M", label: "videos made" },
      { value: "16M+", label: "views" },
      { value: "16", label: "countries" },
    ],
    tech: ["Flash", "PHP", "AWS"],
    media: [{ src: "work/My-Story/images", kind: "image", note: "Screens, 1280x800" }],
    featured: false,
  },
  {
    slug: "walmart-mobile",
    title: "Walmart Mobile",
    client: "Walmart",
    year: "2008",
    role: "Creative Technologist, The Martin Agency",
    summary: "Walmart's first mobile website, built before the iPhone had an App Store.",
    body: [
      "When Walmart wanted to go mobile, we started with the iPhone. Native apps weren't an option yet, so it was a web app: Matthew McDonald designed it, and I built it on an early version of iUI for the animation and view control.",
      "It passed a million page views in under six months.",
    ],
    stats: [{ value: "1M+", label: "page views in 6 months" }],
    tech: ["iUI", "JavaScript", "Mobile Safari"],
    media: [
      { src: "work/walmart/phone/3519227780_50473b8f42_o.jpg", kind: "image", note: "On an iPhone, 494x854" },
      { src: "work/walmart/phone", kind: "image", note: "Screens (610x320) and the original PSD" },
    ],
    featured: false,
  },
  {
    slug: "xmas-ornaments",
    title: "Robot-Painted Ornaments",
    client: "The Martin Agency",
    year: "2014",
    summary: "600+ custom ornaments, painted one at a time by a robot.",
    body: ["We hand-made more than 600 custom holiday ornaments, using a robotic egg painter to draw on each one."],
    tech: ["Robotic egg painter"],
    media: [
      { src: "work/XmasOrnaments/IMG_6082.MOV", kind: "video", note: "Robot painting, 0:24" },
      { src: "work/XmasOrnaments/IMG_6094.JPG", kind: "image", note: "Finished ornaments" },
    ],
    featured: false,
  },
  {
    slug: "modern-chess-clock",
    title: "Modern Chess Clock",
    year: "2026",
    summary: "A clean, modern chess clock for two players on iPhone and iPad.",
    body: ["Increments and delays, saved presets, colour schemes and an end-of-game summary."],
    tech: ["Swift", "SwiftUI"],
    links: [{ label: "Support page", href: "/chess-clock" }],
    media: [{ src: "individual11/assets/chess-clock", kind: "image", note: "Screens + icon" }],
    featured: false,
  },
];
