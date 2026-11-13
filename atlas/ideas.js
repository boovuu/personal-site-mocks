// Atlas notes. Each related reading names its reason.
const atlasSubjects = {
  websites: 'Websites and buyers',
  research: 'Markets and research',
  making: 'Creative methods and stories',
  agents: 'AI and software'
};


const nightSailboatStudy = ['November 6 · A star above the boat','Look to the right of “Marketing growth. Website systems.” The sailboat sits low on the water. A bright star breaks through the clouds above it. At the foot of the full scene, a line from John Masefield’s Sea-Fever puts the two together: “and a star to steer her by”.',{src:'site-editions/v10-night-canon.jpg',alt:'Cream lettering at the left of a dark sea. On the right, a small sailboat sits below a bright star in the storm clouds.',caption:'Explore the November 6 night draft',href:'site-editions/v10-night-canon.html'}];
const hermesPortraitStudy = ['A face drawn in small marks','Bogdan remembers the visual reference coming from Hermes Agent. These two examples show the style he remembers. The exact image Petar saw is still unknown. The first is the portrait on the “Persistent Memory” card. Look at the cheek beneath the eye: short pale marks pick out the light, while the shadow beside the nose falls almost completely black.',{src:'site-editions/hermes-persistent-memory.webp',alt:'A monochrome sculpted face on black. Rows of small pale marks pick out the curls, eyes and cheek.',caption:'“Persistent Memory” artwork · Nous Research, Hermes Agent website',href:'https://hermes-agent.nousresearch.com/'}];
const hermesBackdropStudy = ['A second reference in blue','Hermes Desktop uses this illustration as a faint backdrop. Shown here at its original contrast, a small figure climbs a flight of steps. The lit edges of the steps are bare cream. Broken blue marks give the stone its shadows. You can already see how much shape two colours can carry.',{src:'site-editions/hermes-desktop-backdrop.webp',alt:'A small figure on pale steps beside a much larger sculpted figure. Textured blue ink describes the stone and the shadows.',caption:'View the original backdrop in the Hermes Desktop archive',href:'https://github.com/NousResearch/hermes-agent/blob/51c68d4ab1a9e3c62fb1048fccb84144c409f0e7/apps/desktop/public/ds-assets/filler-bg0.jpg'}];
const dottedSailboatStudy = ['Petar applies the marks to the same sailboat','Find the sail on the right, then follow the bright strip of water beneath it. Both appear in the original night scene. Petar’s saved page contains a smaller copy of that very image. In the Perspective section he renders its dark areas with heavier blue marks and lets white show through the light. You can still locate the boat by the shape of its sail.',{src:'site-editions/petar-dotted-sailboat.png',alt:'The original seascape rendered in small blue marks, with storm clouds on the left and the triangular sail on the right.',caption:'See the dotted sailboat in the working Perspective section',href:'../index.html#approach'}];
const petarSkyStudy = ['November 9 · The dots become the opening sky','Now look at the clouds above the headline. Petar uses the same dots and crosses here, with room for the words in the middle. The browser draws this sky separately. The sailboat image itself appears one section below. Masefield’s line, once at the foot of the night scene, now sits just above the title.',{src:'personal-home-hero.jpg',alt:'Blue marks form a cloud bank around the centered headline “The work behind the website.” The Masefield quotation sits above the title.',caption:'Explore the finished homepage',href:'../index.html#top'}];

const atlasIdeas = [
  {
    id:'website-purpose', mapPoint:[0.58,0.47], mapLabel:'Writing a website brief', trailFrom:'quartermaster', subject:'websites', kind:'Guide',
    title:'What do you want your website to do?',
    summary:'A website brief starts with a person and a decision. Who is visiting, and what should they be able to decide after reading?',
    detail:'One example from the guide is an operations leader deciding whether to request a demonstration. That gives the writer something to work with. The page can show which problems the product solves, who already uses it, and what a demonstration covers.',
    sources:[['Read the website briefing guide','../notes/website-purpose.html']],
    related:[['camouflage','Once you know what the buyer needs to decide, consider how much of the argument the homepage should make for them.'],['brand','A buyer who already knows the brand brings something different to that same page.']]
  },
  {
    id:'camouflage', mapPoint:[0.26,0.25], mapLabel:'Selling through evidence', trailFrom:'website-purpose', subject:'websites', kind:'Essay',
    title:'What happens when a homepage stops trying so hard to sell?',
    summary:'“Sell by camouflaging intent” began with an observation from sales. A buyer can sense when the seller needs a yes.',
    detail:'The essay follows that observation into website copy. If a company shows its work, a prospective buyer can inspect the reasoning and reach a conclusion. The essay draws on sales records and negotiation writing to ask when explicit persuasion gets in the way.',
    sources:[['Read “Sell by camouflaging intent”','../notes/sell-by-camouflage.html']],
    related:[['website-purpose','The companion guide turns the essay’s question into a brief. It asks which decision belongs to the visitor.']]
  },
  {
    id:'brand', mapPoint:[0.78,0.23], mapLabel:'The buyer who knows you', trailFrom:'website-purpose', subject:'websites', kind:'Essay',
    title:'When does the brand sell? When does the website?',
    summary:'Two buyers can visit the same page with very different starting points. One already trusts the company. The other has just heard its name.',
    detail:'The essay asks what each buyer needs and which investment could help. Recognition may begin long before a visit. Once someone arrives, the site can give them evidence, explain the offer and make the next step clear.',
    sources:[['Read the brand and website essay','../notes/brand-and-website.html']],
    related:[['website-purpose','Use the distinction to decide what a specific page should help a buyer do.']]
  },
  {
    id:'quartermaster', mapPoint:[0.34,0.74], mapLabel:'Who decides?', subject:'websites', kind:'Essay',
    title:'What can a pirate quartermaster teach a marketing team?',
    summary:'On the ships in this essay, the captain commanded in battle. The quartermaster handled provisions, distribution and disputes.',
    detail:'The division of responsibility gives the essay its modern question. After a team agrees on a marketing objective, who can allocate resources, resolve a disagreement and answer to the people doing the work?',
    sources:[['Read “The quartermaster’s place”','../notes/quartermaster.html']],
    related:[['website-purpose','A website brief eventually reaches the same practical question. Who owns the decision and the outcome?']]
  },
  {
    id:'healthcare', mapPoint:[0.43,0.52], mapLabel:'Comparing 60 companies', trailFrom:'market-shift', subject:'research', kind:'Research in progress',
    title:'Which healthtech companies might need help with their websites?',
    summary:'A market selloff prompted a question about website work. To investigate, Bogdan compared 30 selected healthtech companies with 30 cybersecurity companies.',
    detail:'Five healthtech companies and four cybersecurity companies showed signs of website or conversion work. The researchers still need to check which companies use Webflow and whether anyone has a budget for outside help.',
    sources:[['The comparison of 60 companies', null],['The separate list of nine pharma leads', null]],
    related:[['market-shift','Go back to the observation that prompted the comparison.'],['vertical-method','See how the comparison led to a proposed test for other industries.'],['pharma','See why the nine pharmaceutical leads were counted separately.']]
  },
  {
    id:'market-shift', mapPoint:[0.7,0.26], mapLabel:'Market selloff',subject:'research',kind:'Starting question',
    title:'What could a market selloff tell us about future website work?',
    summary:'The initial thought was about share prices. The more useful question was whether a change in the market would show up in the work companies needed.',
    detail:'The research draft reconstructs this starting point. It turns the observation into things someone could look for, including hiring for a website team, asking for an outside partner, or setting money aside for a project. The original market dates and indices still need checking.',
    sources:[['How the question was reconstructed', null]],
    related:[['healthcare','Follow the first comparison, where researchers looked for those signs at individual companies.']]
  },
  {
    id:'vertical-method', mapPoint:[0.23,0.21], mapLabel:'Testing buyer demand', trailFrom:'healthcare',subject:'research',kind:'Proposed method',
    title:'How could you tell whether an industry will buy website services?',
    summary:'The proposed Vertical Momentum Lab starts with a company event and asks what evidence would connect it to an actual purchase.',
    detail:'A job listing can tell you which tools a company uses. A request for an outside partner tells you something different. The draft sets out what to check at each step and proposes testing the method in conversations with buyers.',
    sources:[['The proposed research method', null]],
    related:[['healthcare','The healthtech comparison exposed the gap between seeing website activity and finding a buyer.']]
  },
  {
    id:'pharma', mapPoint:[0.62,0.78], mapLabel:'Nine pharma leads', trailFrom:'healthcare',subject:'research',kind:'Research note',
    title:'Where did pharmaceutical website leads turn up?',
    summary:'A separate search found nine leads around pharmaceuticals. Some Webflow projects appeared among companies serving the industry.',
    detail:'The list was assembled to find leads. It used a different selection process from the healthtech and cybersecurity comparison. A project at a service provider also leaves open whether a drug manufacturer would buy the same service.',
    sources:[['The nine-lead discovery note', null]],
    related:[['healthcare','Return to the two groups that researchers screened in the original comparison.']]
  },
  {
    id:'dice', mapPoint:[0.18,0.34], mapLabel:'1 · The first question',subject:'making',kind:'Working creative tool',
    title:'How do you get AI to go beyond the words you give it?',
    summary:'“Do you know some creative processes for AI to commit creative output. Basic ai is not creative enough.” Bogdan wanted to change how an AI arrived at an idea. Gemini’s first reply proposed five ways to work on a brief (conversation, pp. 1–2).',
    sections:[
      ['Oblique Strategies: introduce a constraint','Brian Eno and Peter Schmidt published their Oblique Strategies deck in 1975. Each card offered a short instruction or dilemma for a creative block. Gemini adapted the principle to a prompt by ruling out the most familiar solution, borrowing a tone from elsewhere and solving the problem through an unfamiliar mechanism. A constraint has a practical purpose here. If the obvious answer breaks a rule, the model has a reason to try another. The person writing the brief still chooses what to rule out.'],
      ['Multi-perspective critique: let the objections differ','Gemini called this the “Pixar Braintrust Model”. It suggested giving one draft to a pragmatist, an experimental artist and a devil’s advocate, then rewriting it in light of their disagreement. The pragmatist might ask whether an idea can be made. The artist might ask whether it is worth making. These are roles played by one model, so the useful evidence is what changes in the draft after each objection.'],
      ['Re-classification: borrow a structure','One example was to design the first session of a software product using the pacing of a hero’s journey. The analogy can change when a person meets a difficulty, gets help or experiences a first success. If the stages stay exactly where they were and only their names change, the analogy has done little work.'],
      ['Recursive looping: revise the rule behind a draft','Generate five concepts, pick the strangest, and ask what assumption it still shares with the obvious ones. Then write it again with that assumption broken. Each round supplies material for the next. This distinction would matter in the wolf test, where a more elaborate picture still preserved the original composition.'],
      ['Semantic deconstruction: describe the effect','Gemini took the vague request for an “engaging” pitch introduction and made it concrete. Start halfway through a mistake. Use short sentences. Let the listener sense that something has been left unsaid. The writer can inspect the result and judge whether it creates tension. Later, Gemini tried the same move on the word “wolf”, with quite different consequences.']
    ],
    detail:'Bogdan’s next question introduced a different source of variation. Could a three-card draw or a Celtic Cross quietly structure the answer? Could the person asking the question do something equivalent to cutting the deck? Gemini suggested a phrase or the first five words someone saw in the room (pp. 2–3). The words now had a job in the experiment. The image test would reveal what else Gemini was doing with them.',
    sources:[['Read the opening exchange (transcript excerpts)','dice-origin.txt'],['Open the D.I.C.E. coin and copy the command','../dice.html'],['Read the later rules for the draw','https://gist.githubusercontent.com/boovuu/42303606f20a52a02cd5ff5b69520ffe/raw/RITUAL.md']],
    related:[['dice-wolf','Follow the image test: same request, same five words, different picture.'],['four-brothers','A proposed next experiment would have four reviewers examine what someone made with the cards.'],['trust','Read the later essay that compares a card draw with a recorded Banana Wars match.']]
  },
  {
    id:'dice-wolf', mapPoint:[0.56,0.24], mapLabel:'2 · The wolf test', trailFrom:'dice',subject:'making',kind:'Gemini experiment',
    title:'Could the same five words lead to a different picture?',
    summary:'Bogdan asked Gemini to write a prompt he could paste into a fresh chat. His brief was “i want to create an image, visually striking, out of this world, never seen before, introducing new color, just beautiful”. He left the subject open. To see what the hidden card draw would suggest, he gave it five words to shuffle with.',
    detail:'What made the second prompt feel different was where the scene came from. In Gemini’s account of the draw, the Nine of Pentacles suggested an immaculate, secluded space. The Three of Swords gave that space a fracture. The High Priestess drew the camera close to a strange liquid catching the light inside it. Bogdan had asked for beauty and an unfamiliar colour. White stone and liquid metal were Gemini’s way of answering that request. His next message began, “This sounds good”.',
    sources:[['Read the corrections and compare the two prompts','dice-origin.txt'],['Read the instructions for a D.I.C.E. session','https://gist.githubusercontent.com/boovuu/42303606f20a52a02cd5ff5b69520ffe/raw/RITUAL.md']],
    related:[['dice-trials','Follow the five-word method into a homepage, a game and another image.'],['dice','Go back to the five creative processes in the opening exchange.']]
  },
  {
    id:'dice-trials', mapPoint:[0.83,0.39], mapLabel:'3 · Field tests', trailFrom:'dice-wolf',subject:'making',kind:'Gemini experiments',
    title:'Would the five-word method work on another brief?',
    summary:'The wolf and the white stone came from the same five words. After that, Bogdan kept the five-word procedure and supplied fresh words for each task. Changing both the brief and the words made these trials a way to find weaknesses. They could not, on their own, measure an improvement in creativity.',
    sections:[
      ['A satirical agency homepage','The very next brief asked for a polished agency website whose respectable exterior concealed a satire. The words were “pentagon, viscose, pellets, broom, saps”. In its explanation, Gemini associated viscose with slick language and a broom with sweeping data away. The result served the brief, but Bogdan could still trace its ideas back to the meanings of his words. He asked Gemini to explain the logic and whether it had actually done a tarot reading (pp. 14–16).'],
      ['Trying the method on advice','With “despise, caravel, blending, sock, juice”, Bogdan switched from making an object to thinking through a career decision. Gemini used a three-card reading to frame a practical step: turn completed work into a case study. Here the reader could judge whether the suggestion was useful. The conversation records the suggestion, without a follow-up showing what happened when it was tried (pp. 16–17).'],
      ['A game built on sand','Bogdan returned to game design with “sand, markpliers, forklift, zion, poof”. Gemini proposed Granular Apex. The player moved heavy cargo over sand that slipped away under the wheels. Here the evidence was visible in the rules of the game. One of the five words had become the ground the whole game depended on. Bogdan asked, “why did you use sand?” (pp. 16–19).'],
      ['An orchid field seen through glass','For Petar’s image, the brief already specified pastel orchids, one blue bloom in focus and a glass-like blur. The five words were “komp, ekran, telefon, mis, tastatura”. Gemini borrowed backlighting from a screen and repeated patterns from a keyboard. The flowers stayed central, yet the explanation still traced their treatment to the seed. The glass effect was already in the brief, so the finished description alone could not establish what the five words had contributed (pp. 21–22).'],
      ['Putting the rule into writing','Bogdan asked for instructions he could paste into a document and later for a version he could try with another model (pp. 19–24). The exported prompt still invited the AI to extract sensory qualities from the words. The later D.I.C.E. specification gives them one precise job. Code converts the words into a number that determines the cards. Once dealt, the cards and the brief supply the material for the reading. Repeating the words lets someone check the draw.']
    ],
    detail:'The wolf trial supplied a striking example. The sand trial supplied a way to catch the old habit when it returned. That leaves a design question for the next stop. How do you show the difference between the starting point chance gives you and the direction you decide to take?',
    sources:[['Read the trial notes and page references','dice-origin.txt'],['Read the rules of the later draw','https://gist.githubusercontent.com/boovuu/42303606f20a52a02cd5ff5b69520ffe/raw/RITUAL.md']],
    related:[['dice-coin','See how the design gives the draw and the human decision a face each.'],['dice-wolf','Revisit the one trial that held the five words constant.']]
  },
  {
    id:'dice-coin', mapPoint:[0.77,0.67], mapLabel:'4 · The coin', trailFrom:'dice-trials',subject:'making',kind:'Illustrated object',
    title:'Who put Cassiopeia on the coin?',
    summary:'On 11 October 2026, Bogdan asked Claude to design a two-sided coin for his personal website. He had already chosen what belonged on each face. A compass would stand for the courage to choose a direction. A small constellation would stand for the starting point chance could give him in D.I.C.E. The constellation still had to be drawn.',
    sections:[
      ['A small detail in the first website brief','Two days earlier, after seeing three homepage proposals, Bogdan had sent an editorial brief that floated an astrolabe or a coin as a hidden detail. Both already belonged to the crew’s visual language. Killick had a brass coin engraved with a giving hand, Metis a navigator’s astrolabe, and Bogdan five irregular dots called the Captain’s Seed. In the October 11 brief he asked Claude to preserve all three while drawing the new object.'],
      ['Claude named the object and set the course','Claude proposed “The Reckoning Coin”. The name came from dead reckoning, where a navigator estimates a position from a known starting point and a chosen heading. Claude called the faces Bearing and Seed and suggested putting Bearing first on the personal site and Seed first in D.I.C.E. The compass line points to 022.5°, north-northeast. The off-north heading is a choice someone has made. A later review explicitly asked to keep that angle.'],
      ['Bogdan recognised a constellation','Looking at the proposal that afternoon, Bogdan asked, “oh my god can we use it? should we connect the 5 stars to cassiopeia ?” Claude redrew the stars from their sky positions, varied their sizes by brightness and added a dashed line towards Polaris. Cassiopeia gave the Seed face a practical role in the drawing. The stars help you find north. Turn the coin and the compass shows where you have chosen to go.'],
      ['When the five stars became five words','The October 11 study kept the Captain’s five-dot mark as a separate emblem. On October 23 the D.I.C.E. story page gave readers a more specific way to read the stars on this coin: one for each word they bring to the draw. That line ties the finished object back to the creative experiment.']
    ],
    detail:'In the Atlas you can trace the finished drawing back to five marks and a constellation, then turn the coin. The earlier stages are reconstructed drawing studies.',
    sources:[['Read the October 11 coin design study','../identity-studies/reckoning-coin-cassiopeia.html'],['See the October 23 five-word story page','../dice-story.html'],['Try the illustrated coin and its D.I.C.E. command','../dice.html']],
    related:[['personal-site','See the rejected homepages, the boat at sea and the sky above the eventual headline.'],['dice-trials','Return to the experiments that established what the five words should do.']]
  },
  {
    id:'personal-site', nextStop:'site-precision', mapPoint:[0.12,0.42], mobilePoint:[0.20,0.10], mapLabel:'The brief',subject:'websites',kind:'Design history',
    title:'What did Bogdan want his own website to show?',
    summary:'On 9 October 2026, Bogdan wanted a project on which he could try Source by Webflow. A personal site would let him use his skills together and give a potential client a reason to hire him. That afternoon he described what a visitor should see: “a prsentation of good work how everything is connected and built with reason.”',
    sections:[
      ['October 9 · Three homepages and a new brief','Hermes built three versions. One used black and white with an indigo accent, one resembled a terminal, and one drew on the Privateer Registry. From his phone Bogdan replied, “I hate all three directions.” He wanted breathing room, a serif with character and a way to show the reasoning behind the work. In the brief he sent back, a coin or an astrolabe could appear as a small detail. A later editorial version gave him a line to build around: “A website should carry the work.”'],
      ['October 11 · The detail becomes an object','Bogdan brought Claude a brief for a compass on one face and a constellation on the other. After Claude proposed the name Reckoning Coin, Bogdan suggested Cassiopeia. Hermes filed the identity study that afternoon. The design gave the personal site the Bearing face and D.I.C.E. the Seed face. The archive preserves the Claude exchange and the filed study. The intermediate GPT refinement is still missing.'],
      ['October 11 to November 6 · A boat small enough for the sea','An evening commit added a cinematic preview with a lone sailboat, storm clouds and one bright star. The commissioning exchange is missing. Weeks later, in the November 6 walkthrough, Hermes recorded what Bogdan wanted the scene to convey: “sitni si u velikom strašnom moru ali hrabar jer imaš cilj” — you are small in a vast, frightening sea, but brave because you have a destination. The night design became a site draft.',{src:'../assets/cinematic-sea.png',alt:'A lone sailboat beneath storm clouds and a bright star.',caption:'The cinematic preview image, added to the site archive on October 11.'}],
      ['November 9 · A sky made of dots and crosses','Petar worked from the sailboat image. Inspired by the graphics of Hermes Agent, he gave the scene a dotted treatment. You can see the same sailboat in blue dots in the Perspective section. Above the title, the page draws a separate sky with the same marks. The ship and lighthouse appear in an engraving farther down the page.',{src:'personal-home-hero.jpg',alt:'The personal homepage with a dithered sky behind the headline The work behind the website.',caption:'The November editorial homepage, rendered from the recovered page. Its sky is drawn by the browser.'}]
    ],
    detail:'Open the homepage to see the sky at its original scale. The D.I.C.E. section farther down carries the line from the coin brief, “Chance opens. The bearing is yours.”',
    sources:[['Open the homepage','../index.html'],['See Petar’s ship-and-lighthouse engraving from the story section','personal-story-engraving.jpg'],['Read the dated archive references','dice-origin.txt'],['Open the first October 9 mockup','site-editions/v1-vercel-precision.html'],['Open the cinematic seascape','../assets/cinematic-sea.png'],['View the November 6 night draft','site-editions/v10-night-canon.html']],
    related:[['dice-coin','Read the exchange in which the five stars became Cassiopeia.'],['website-purpose','Read the website brief that starts with the decision a visitor needs to make.']]
  },
  {
    id:'site-precision', nextStop:'site-terminal', trailFrom:'personal-site', mapPoint:[0.36,0.13], mobilePoint:[0.73,0.16], mapLabel:'V1 · Precision', subject:'websites',kind:'Homepage proposal · October 9',
    title:'Vercel precision', summary:'Hermes set “I make Webflow sites measurably grow” in white and grey on black. Indigo carried the visitor’s eye to the consultation button.',
    edition:['site-editions/v1-vercel-precision.jpg','The first proposal, with a black background, a large white headline and an indigo button.','site-editions/v1-vercel-precision.html'],
    detail:'The reasons toggle opens the annotations attached to the headline, work samples and call to action. This was one of three alternatives Bogdan reviewed together that evening.',
    sources:[['Open the October 9 design','site-editions/v1-vercel-precision.html']],related:[['site-terminal','See how the same headline changes in a terminal.'],['site-verdict','Read Bogdan’s response to the three proposals.']]
  },
  {
    id:'site-terminal', nextStop:'site-registry', trailFrom:'personal-site', mapPoint:[0.41,0.40], mobilePoint:[0.28,0.31], mapLabel:'V2 · Terminal',subject:'websites',kind:'Homepage proposal · October 9',
    title:'Terminal ember', summary:'The second proposal turned the same promise into a command line. A cursor followed the headline, work appeared as a commit log, and booking a consultation looked like running a command.',
    edition:['site-editions/v2-terminal-ember.jpg','The second proposal presents the homepage in monospaced terminal type.','site-editions/v2-terminal-ember.html'],
    detail:'This is where the type Bogdan called “prgrammy” is easiest to see. His verdict came after reviewing all three designs.',
    sources:[['Open the October 9 design','site-editions/v2-terminal-ember.html']],related:[['site-registry','Open the third proposal from the same afternoon.'],['site-verdict','Read the review of all three.']]
  },
  {
    id:'site-registry', nextStop:'site-verdict', trailFrom:'personal-site', mapPoint:[0.24,0.74], mobilePoint:[0.75,0.38], mapLabel:'V3 · Registry',subject:'websites',kind:'Homepage proposal · October 9',
    title:'The Privateer Registry',summary:'Hermes used the crew’s maritime vocabulary throughout the third proposal. Projects became voyages in a ledger, and the visitor could seal a commission. The headline read “Growth, measured & built with reason”.',
    edition:['site-editions/v3-privateer-registry.jpg','The third proposal uses the look of a privateer’s ledger and a serif headline.','site-editions/v3-privateer-registry.html'],
    detail:'In the brief that followed, Bogdan kept a place for a small navigation mark. He wanted visitors to pay attention to the work that surrounded it.',
    sources:[['Open the October 9 design','site-editions/v3-privateer-registry.html']],related:[['site-verdict','Read the message Bogdan sent from his phone.']]
  },
  {
    id:'site-verdict', nextStop:'site-sailboat',trailFrom:'site-terminal',alsoFrom:['site-precision','site-registry'],mapPoint:[0.57,0.55],mobilePoint:[0.28,0.53],mapLabel:'Why all three fell short',subject:'websites',kind:'Design review · October 9',
    title:'Why did Bogdan reject all three?',summary:'“I hate all three directions. Dont like dark or at least on that setupx lacks breathing area. Hate prgrammy fonts”',
    sections:[
      ['The next three tries gave the words more room','Bogdan sent that message from his phone. Hermes kept the opening promise about growth and tried three ways of setting it on a light page. Warm Minimal used the rounded letters of Fraunces. Gallery set the same words in a finer serif and called the projects “Selected work”. Editorial Sunlight tried a taller, narrower headline. You can open all three drafts below.'],
      ['V7 gave the navigation motif a smaller role','In his next message Bogdan asked for warm paper, dark ink and a serif with character. A coin or an astrolabe could be a detail someone discovered along the way. Hermes built The Chart around that brief, with a small astrolabe mark, Source Serif 4 and notes in the margins explaining design choices.'],
      ['V8 · The proposal Bogdan brought back from ChatGPT','Later that evening Bogdan sent a zip of a proposal he called a good starting point. Its opening line was “A website should carry the work.” Beside it, a deep teal diagram traced a route from content through platform and measurement to improvement. A visitor could see what Bogdan meant by running a website before reading a single case study.',{src:'site-editions/v8-gpt-concept.jpg',alt:'GPT’s cream homepage with the word carry in teal italics and a dark teal route diagram alongside the headline.',caption:'Open GPT’s original proposal (v8)',href:'site-editions/v8-gpt-concept.html'}],
      ['V9 · What stayed when Hermes combined the two','Look at the opening again. The headline, the teal route diagram and the “See how I work” link all survived from GPT’s page. The letterforms came from The Chart. Scroll down and the difference gets easier to spot. Where GPT used client names, v9 describes the industry and the work. Turn on “Reasons” at the top to read why the author put each section there.',{src:'site-editions/v9-carries-the-work.jpg',alt:'The first v9 homepage retains the headline and route diagram and adds a Reasons control at the top.',caption:'Open the first v9 and try the Reasons button',href:'site-editions/v9-carries-the-work.html'}]
    ],
    detail:'The map beside the headline was still a diagram in v9. In the later night draft, a little boat under a star gave that idea of finding a direction a scene of its own.',
    sources:[['V4 · Warm Minimal','site-editions/v4-warm-minimal.html'],['V5 · Gallery','site-editions/v5-gallery.html'],['V6 · Editorial Sunlight','site-editions/v6-editorial-sunlight.html'],['V7 · The Chart','site-editions/v7-the-chart.html'],['Dated archive references','dice-origin.txt']],related:[['site-sailboat','Continue to the sailboat and its guiding star.'],['personal-site','Read the full account of the brief.']]
  },
  {
    id:'site-sailboat',trailFrom:'site-verdict',nextStop:'site-hermes',mapPoint:[0.79,0.30],mobilePoint:[0.73,0.55],mapLabel:'The sailboat',subject:'websites',kind:'Night homepage draft · November 6',
    title:'One boat under a much larger sky',summary:'The sea image entered the archive on October 11. In the November 6 night draft the headline shared the opening screen with the small sailboat, the storm and a single guiding star.',
    edition:['site-editions/v10-night-canon.jpg','The November night homepage with its headline, one small boat, and a star above the dark sea.','site-editions/v10-night-canon.html'],
    detail:'In the walkthrough Bogdan put it this way in Serbian: “sitni si u velikom strašnom moru ali hrabar jer imaš cilj”. The boat is small in a frightening sea, but having somewhere to go gives you courage. Petar took this image as the starting point for the next version. Look at the clouds above the sailboat, then follow them into his dotted sky.',
    sources:[['View the November 6 draft source','site-editions/v10-night-canon.html'],['Open the original sea image','../assets/cinematic-sea.png']],related:[['site-verdict','Trace the earlier designs that led to the night draft.']]
  },
  {
    id:'site-hermes',trailFrom:'site-sailboat',mapPoint:[0.88,0.57],mobilePoint:[0.27,0.70],mapLabel:'Hermes Agent',subject:'websites',kind:'Visual reference',
    title:'The dots in Hermes Agent',summary:'When Petar worked on the sailboat, he drew on a way of making pictures he had seen in Hermes Agent.',
    sections:[hermesPortraitStudy,hermesBackdropStudy],
    detail:'Look for the same shift from dense marks to open paper in Petar’s version of the sea.',
    nextStop:'site-dotted-sailboat',
    sources:[['Read the archive note on the reference','dice-origin.txt']],related:[['site-sailboat','Revisit the original night scene.']]
  },
  {
    id:'site-dotted-sailboat',trailFrom:'site-hermes',mapPoint:[0.69,0.77],mobilePoint:[0.73,0.83],mapLabel:'The dotted sailboat',subject:'websites',kind:'Image study',
    title:'The dotted sailboat',summary:'Petar used the original night image to make the illustration that appears in the homepage’s Perspective section.',
    sections:[dottedSailboatStudy],detail:'Farther up the page, Petar used the same marks to draw a sky around the headline.',
    nextStop:'site-petar',
    sources:[['Open the original sea image','../assets/cinematic-sea.png']],related:[['site-hermes','Look again at the Hermes references.']]
  },
  {
    id:'site-petar',trailFrom:'site-dotted-sailboat',mapPoint:[0.34,0.90],mobilePoint:[0.29,0.93],mapLabel:'Petars design',subject:'websites',kind:'Editorial homepage · November 9',
    title:'Petars design',summary:'Blue dots and tiny crosses gather into clouds above “The work behind the website”. The star and Masefield’s line carry the idea of the night voyage into the finished opening.',
    sections:[petarSkyStudy],
    comparison:[nightSailboatStudy,hermesPortraitStudy,hermesBackdropStudy,dottedSailboatStudy,petarSkyStudy],
    detail:'Petar’s Design Direction skill starts with what the reader should notice first. Here, the clouds part around the headline and leave enough white space for the words to stand out. The November 9 editorial brief supplied the final headline, “The work behind the website”, and the introduction about the people and decisions behind a site.',
    sources:[['November 6 · Source of the sailboat draft','site-editions/v10-night-canon.html'],['November 9 · The editorial homepage as it shipped','../index.html']],related:[['dice-coin','See how the idea of choosing a course appears on the compass face of the coin.']]
  },
  {
    id:'four-brothers', mapPoint:[0.64,0.88], mapLabel:'Reviewing a draw', trailFrom:'dice',subject:'making',kind:'Review method',
    title:'How would four different reviewers test the same idea?',
    summary:'Četiri brata gives each reviewer a job. One builds the case, one challenges it, one checks it, and one draws the findings together.',
    detail:'One suggestion was to use the four roles to evaluate the result of a D.I.C.E. experiment. The project note records the suggestion. A worked example is still missing.',
    sources:[['The project note on the four roles', null]],
    related:[['dice','Try the method that prompted the suggestion for a four-part review.']]
  },
  {
    id:'kata-vera', mapPoint:[0.32,0.24], mapLabel:'Kata and Vera',subject:'making',kind:'Illustrated stories',
    title:'How did Kata and Vera come to share a story?',
    summary:'Kata’s encounter with a bird and Vera’s garden belong to separate sets of drawings. Their paths meet in “Zvono koje je zvonilo dvaput.”',
    detail:'The story archive keeps early scenes alongside approved illustrations and finished books. Two of the drawings below come from those earlier stories. Their shared book, whose title means “The bell that rang twice,” is one of five collected in the archive.',
    sources:[['View a drawing from Kata’s bird story','kata-bird.jpg'],['View a drawing from Vera’s garden story','vera-garden.jpg']],
    related:[['atlas-drawings','Compare how the Atlas uses successive drawings to tell the history of a research question.']]
  },
  {
    id:'atlas-drawings', mapPoint:[0.66,0.7], mapLabel:'Drawing a research question', trailFrom:'kata-vera',subject:'making',kind:'Design study',
    title:'What makes a drawing in the Atlas grow?',
    summary:'A first sketch can hold one question. A comparison, a source or an unanswered objection can each give the artist a reason to draw another line.',
    detail:'The healthtech study redraws one question three times. The AI-search study uses dated documents to decide what appears in each period. In both, you can see what was added and ask what justified the addition.',
    sources:[['The original design study', null],['How the illustrated atlas began', null]],
    related:[['healthcare','Look at the three drawings side by side and see where the pharma question entered.'],['aeo','Open the dated drawings to see how individual documents added detail.']]
  },
  {
    id:'aeo', mapPoint:[0.69,0.71], mapLabel:'An AI misreads a site',subject:'agents',kind:'Illustrated research archive',
    title:'What happens when an AI answer disagrees with the website?',
    summary:'In 2023, an early note recorded a mismatch between an AI answer and the site it described. The archive follows that question through ten source records from 2023 to 2026.',
    detail:'This became a study of answer engine optimization (AEO), or how websites appear in AI-generated answers. Choose a year in the illustrated archive to see which observations and sources had been recorded by then.',
    sources:[['Explore the drawing by year','aeo.html#plate'],['Browse the ten source records','aeo.html#inventory']],
    related:[['agent-interfaces','The next question goes from what a system can read on a website to what it can actually do there.'],['atlas-drawings','See the design decision behind the changing illustration.']]
  },
  {
    id:'banana-wars', mapPoint:[0.14,0.86], mapLabel:'Banana Wars', trailFrom:'trust',subject:'agents',kind:'Game experiment',
    title:'Banana Wars: what did the AI player actually do?',
    summary:'In Banana Wars, each move leaves a record. Three saved matches let a reader compare what an agent attempted with what the game recorded.',
    detail:'The match records contain action identifiers, turn numbers and outcomes. A later draft used one of those matches alongside a D.I.C.E. draw to ask what another person could check afterward.',
    sources:[['The match record', null],['The comparison with the card draw', null]],
    related:[['trust','Read the draft that brought the two projects together.']]
  },
  {
    id:'trust', mapPoint:[0.31,0.59], mapLabel:'A later essay about trust', trailFrom:'dice',subject:'agents',kind:'Unpublished draft',
    title:'Could another person reconstruct what the agent did?',
    summary:'A draft post about trust grew out of two records, a repeatable D.I.C.E. draw and a logged Banana Wars match.',
    detail:'The proposed test is to give a second person the task of reconstructing the result, then see what they can recover after the logs are removed. The post is written. The test remains a proposal.',
    sources:[['The draft post', null],['The proposed test', null]],
    related:[['banana-wars','Examine the match record behind the draft.'],['dice','See how to reproduce the other half of the comparison.']]
  },
  {
    id:'agent-interfaces', mapPoint:[0.28,0.3], mapLabel:'An agent uses a site', trailFrom:'aeo',subject:'agents',kind:'Research question',
    title:'How can a person and an AI agent use the same website?',
    summary:'A person can see a control on a page. An agent needs to discover which action is available, what it requires and whether it worked.',
    detail:'The website research explores how a site might expose those actions. The game provides a smaller example to inspect today, because each turn has an explicit state and a recorded outcome.',
    sources:[['The webmcp website research', null]],
    related:[['banana-wars','Inspect an example where the available action and its result are both recorded.'],['aeo','Read the earlier question about how machines interpret website content.']]
  }
];


// Each territory starts at a named idea. New notes with a trailFrom grow its coast.
const atlasTerritories = [
  {root:'market-shift', center:[0.19,0.25], mobileCenter:[0.24,0.12], title:'Looking for website demand', description:'A market selloff led to a comparison of 60 companies and a proposed way to test whether buyers need website help.'},
  {root:'quartermaster', center:[0.80,0.15], mobileCenter:[0.76,0.29], title:'Writing for buyers', description:'An essay about who makes decisions opens a website brief. Two companion essays ask how the site can help a buyer decide.'},
  {root:'dice', center:[0.43,0.55], mobileCenter:[0.28,0.51], title:'D.I.C.E. and the Reckoning Coin', description:'How could an AI surprise the person writing the prompt? Follow the numbered path from the first question through the wolf and field tests to the finished coin.'},
  {root:'aeo', center:[0.15,0.82], mobileCenter:[0.76,0.70], title:'How AI reads websites', description:'An early mistake in an AI answer raised a question about what machines can read on a website and what they can do there.'},
  {root:'personal-site', center:[0.74,0.43], mobileCenter:[0.72,0.49], title:'The personal website', description:'Follow the sailboat through the Hermes references and Petar’s dotted drawing to the finished homepage.'},
  {root:'kata-vera', center:[0.83,0.74], mobileCenter:[0.32,0.89], title:'Thinking in drawings', description:'Read the story illustrations alongside the Atlas design study. In both, successive drawings let you see what changed.'}
];
