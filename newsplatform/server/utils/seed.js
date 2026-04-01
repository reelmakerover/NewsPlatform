require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Article = require('../models/Article');
const Video = require('../models/Video');

const categories = [
  { name: 'Technology', slug: 'technology', color: '#6366F1', icon: '💻', description: 'Latest tech news from India and the world' },
  { name: 'Business', slug: 'business', color: '#F59E0B', icon: '📊', description: 'Startup ecosystem, markets, and economy' },
  { name: 'Viral', slug: 'viral', color: '#EF4444', icon: '🔥', description: 'Trending stories taking the internet by storm' },
  { name: 'Law & Policy', slug: 'law', color: '#10B981', icon: '⚖️', description: 'Legal developments and government policy' },
];

const articleTemplates = [
  {
    title: 'India Surpasses Japan to Become World\'s Third Largest Economy',
    excerpt: 'India has officially overtaken Japan in nominal GDP terms, marking a historic milestone in the country\'s economic journey and cementing its position as a global powerhouse.',
    content: `<p>In a landmark development for the Indian economy, the International Monetary Fund (IMF) has confirmed that India has surpassed Japan to become the world's third-largest economy by nominal GDP. This milestone, which economists had long projected, arrived ahead of schedule, driven by robust growth in manufacturing, services, and digital sectors.</p>
<h2>What Drove the Growth?</h2>
<p>The surge has been powered by multiple factors: India's booming startup ecosystem, massive infrastructure investment under the PM Gati Shakti program, and a demographic dividend that has produced one of the world's largest and youngest workforces.</p>
<p>Finance Minister Nirmala Sitharaman called the achievement "a testament to the resilience and aspirations of 1.4 billion Indians." The milestone comes as India's GDP crossed the $4.5 trillion mark, edging past Japan's $4.2 trillion.</p>
<h2>What This Means for Indians</h2>
<p>While the nominal GDP figure represents national output, per capita income remains significantly lower than developed nations. Economists stress that the focus must now shift to ensuring growth is inclusive and reaches the bottom of the pyramid.</p>`,
    categorySlug: 'business',
    tags: ['economy', 'GDP', 'India', 'growth'],
    isFeatured: true,
    isTrending: true,
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop',
    readTime: 4
  },
  {
    title: 'Reliance Jio 6G Launch: India to Lead Next Telecom Revolution',
    excerpt: 'Mukesh Ambani announces Jio\'s aggressive 6G rollout plan, promising to make India one of the first nations to deploy the technology at scale by 2026.',
    content: `<p>Reliance Industries Chairman Mukesh Ambani unveiled a sweeping vision for Jio's 6G network at the company's Annual General Meeting, promising to connect every corner of India with ultra-fast connectivity that would make the country a global benchmark for digital infrastructure.</p>
<h2>The Technical Leap</h2>
<p>6G promises theoretical speeds of up to 1 terabit per second — roughly 100 times faster than 5G. Jio's plan involves deploying a hybrid satellite-terrestrial network that would eliminate dead zones even in the most remote Himalayan villages.</p>
<h2>Made in India Hardware</h2>
<p>Perhaps most significantly, Ambani confirmed that the entire network stack — from radio access nodes to core routing equipment — will be manufactured domestically under the Make in India initiative, reducing dependence on foreign vendors and creating an estimated 200,000 direct jobs.</p>`,
    categorySlug: 'technology',
    tags: ['Jio', '6G', 'telecom', 'Reliance'],
    isFeatured: true,
    isTrending: true,
    thumbnail: 'https://images.unsplash.com/photo-1562408590-e32931084e23?w=1200&h=630&fit=crop',
    readTime: 5
  },
  {
    title: 'Supreme Court Rules on Right to Digital Privacy: A Landmark Judgment',
    excerpt: 'The Supreme Court of India delivers a historic 9-0 verdict expanding digital privacy rights, setting strict guidelines for government surveillance and data collection.',
    content: `<p>In what legal experts are calling the most significant judgment of the decade, the Supreme Court of India has unanimously ruled that the right to digital privacy is a fundamental right under Article 21 of the Constitution, and cannot be curtailed without "compelling state interest" and judicial oversight.</p>
<h2>Key Provisions of the Judgment</h2>
<p>The 487-page judgment lays down a three-part test for any government surveillance program: necessity, proportionality, and procedural safeguards. It strikes down several provisions of the IT Amendment Rules that allowed bulk data collection without warrants.</p>
<h2>Impact on Tech Companies</h2>
<p>The ruling will have far-reaching implications for both domestic and foreign technology companies operating in India. Companies will now be required to store user data within Indian borders and provide clear opt-out mechanisms for all forms of data collection.</p>`,
    categorySlug: 'law',
    tags: ['Supreme Court', 'privacy', 'digital rights', 'judgment'],
    isFeatured: false,
    isTrending: true,
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=630&fit=crop',
    readTime: 6
  },
  {
    title: 'Zepto\'s $1 Billion Fundraise: Quick Commerce is Eating Indian Retail',
    excerpt: 'Mumbai-based quick commerce startup Zepto closes a $1 billion Series G at a $5 billion valuation, signaling that 10-minute delivery is here to stay.',
    content: `<p>Zepto, the quick commerce darling founded by two Stanford dropouts from Mumbai, has closed a $1 billion funding round at a $5 billion valuation — one of the largest rounds ever for an Indian consumer startup. The round was led by General Catalyst with participation from Nexus Venture Partners and Motilal Oswal.</p>
<h2>The Quick Commerce War</h2>
<p>The fundraise intensifies the battle between Zepto, Blinkit (owned by Zomato), and Swiggy Instamart. Together, the three companies have fundamentally changed how urban Indians shop for groceries, delivering goods faster than it takes to walk to a corner store.</p>
<h2>Unit Economics: Finally Profitable?</h2>
<p>For the first time, Zepto's filings show contribution margin positivity in mature markets like Mumbai and Delhi. Founder Aadit Palicha says the company expects to achieve EBITDA breakeven by Q2 next year, a milestone that would silence critics who questioned the model's viability.</p>`,
    categorySlug: 'business',
    tags: ['startup', 'quick commerce', 'Zepto', 'funding'],
    isFeatured: true,
    isTrending: false,
    thumbnail: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=630&fit=crop',
    readTime: 5
  },
  {
    title: 'Chandrayaan-4 Mission: ISRO Plans First Crewed Moon Landing by 2040',
    excerpt: 'ISRO Chairman announces ambitious roadmap including a lunar sample return mission by 2027 and India\'s first crewed lunar landing within the next two decades.',
    content: `<p>Following the triumphant success of Chandrayaan-3, the Indian Space Research Organisation is thinking even bigger. ISRO Chairman Dr. S. Somnath unveiled a comprehensive deep space exploration roadmap that includes a lunar sample return mission, a crewed orbital station, and ultimately, Indian astronauts walking on the Moon by 2040.</p>
<h2>The Gaganyaan Foundation</h2>
<p>The crewed Moon mission builds directly on Gaganyaan, India's indigenous human spaceflight program. ISRO plans to use lessons learned from the Earth-orbit missions to develop life support and propulsion systems capable of sustaining astronauts on a 10-day round trip to the lunar surface.</p>
<h2>Commercial Partnerships</h2>
<p>In a departure from ISRO's traditionally self-reliant approach, the agency is actively courting private sector partners. Companies like Skyroot Aerospace and Agnikul Cosmos are expected to develop lunar payload delivery vehicles, mirroring NASA's Commercial Lunar Payload Services model.</p>`,
    categorySlug: 'technology',
    tags: ['ISRO', 'moon', 'space', 'Chandrayaan'],
    isFeatured: true,
    isTrending: true,
    thumbnail: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=1200&h=630&fit=crop',
    readTime: 5
  },
  {
    title: 'UPI Crosses 20 Billion Transactions: How India Built the World\'s Best Payments System',
    excerpt: 'UPI sets a new global record with over 20 billion monthly transactions, as countries from Singapore to Brazil adopt India\'s payment stack as their own.',
    content: `<p>The Unified Payments Interface has achieved what no other payments network in history has — 20 billion transactions in a single month, with a combined value exceeding ₹20 lakh crore. From chai stalls in Varanasi to five-star hotels in South Mumbai, QR codes have become as Indian as chai itself.</p>
<h2>The Architects of a Revolution</h2>
<p>The story of UPI is the story of iSPIRT, NPCI, and a group of engineers who decided that payments should be as simple as sending a text message. Unlike credit card infrastructure that took decades to build, UPI went from concept to 20 billion monthly transactions in under eight years.</p>
<h2>India Exports Its Stack</h2>
<p>Perhaps UPI's greatest achievement is geopolitical. Singapore's PayNow, Bhutan's drukPay, and Brazil's Pix were all modelled on or directly connected to UPI. The RBI is now in talks with 30 more countries to integrate UPI — transforming India's payment infrastructure into a global public good.</p>`,
    categorySlug: 'technology',
    tags: ['UPI', 'fintech', 'payments', 'digital India'],
    isFeatured: false,
    isTrending: true,
    thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=630&fit=crop',
    readTime: 6
  },
  {
    title: 'Viral: Elderly Teacher\'s Chalk Art Goes Global, Gets Google Doodle',
    excerpt: 'A 68-year-old school teacher from Rajasthan whose intricate blackboard chalk drawings went viral on Twitter has been honoured with a Google Doodle visible in 50 countries.',
    content: `<p>Sometimes, the internet gets things right. When a student in Barmer, Rajasthan posted a video of her 68-year-old mathematics teacher, Ramesh Chandra Sharma, creating a breathtaking geometric chalk mural on a cracked blackboard, nobody expected it to be seen by 40 million people.</p>
<h2>From Barmer to the World</h2>
<p>The video, shot on a ₹8,000 smartphone, captured 45 minutes of Sharma's work compressed into a 2-minute timelapse. His geometric designs — inspired by traditional Rajasthani rangoli patterns but interpreted through the lens of mathematical precision — stunned viewers worldwide.</p>
<h2>The Google Doodle</h2>
<p>Within three weeks, Google's Doodle team had contacted Sharma directly. The resulting doodle, designed in collaboration with the artist himself and visible on Google's homepage in 50 countries, is believed to be the first time a sitting government school teacher has been honoured by Google.</p>`,
    categorySlug: 'viral',
    tags: ['viral', 'teacher', 'Rajasthan', 'Google Doodle', 'art'],
    isFeatured: false,
    isTrending: true,
    thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=630&fit=crop',
    readTime: 4
  },
  {
    title: 'New Labour Code: What India\'s 4-Day Work Week Proposal Means for You',
    excerpt: 'The Ministry of Labour proposes amendments to the 4 Labour Codes allowing employers to offer 4-day work weeks with 12-hour shifts, triggering fierce debate.',
    content: `<p>The Union Ministry of Labour and Employment has proposed a significant amendment to the recently consolidated Labour Codes that would formally permit a four-day work week model, provided daily working hours are extended to 12. The proposal has set off a furious debate among workers, employers, economists, and social scientists.</p>
<h2>The Fine Print</h2>
<p>The proposal is permissive, not mandatory. Employers can offer the four-day option; employees can choose to accept or decline. However, critics point out that in industries with strong employer bargaining power, the "choice" may be illusory.</p>
<h2>Global Context</h2>
<p>India's proposal aligns with a global conversation about work-life balance. Iceland, the UK, and Japan have all run four-day work week pilots, with largely positive results for productivity and employee satisfaction. However, those models typically featured compressed hours rather than extended daily shifts.</p>`,
    categorySlug: 'law',
    tags: ['labour law', 'work week', 'policy', 'employment'],
    isFeatured: false,
    isTrending: false,
    thumbnail: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=630&fit=crop',
    readTime: 5
  },
  {
    title: 'Mumbai\'s ₹3 Lakh Crore Dharavi Redevelopment: Dream or Displacement?',
    excerpt: 'Asia\'s largest slum redevelopment project begins demolition of first phase. Residents and activists raise serious concerns even as the government promises world-class housing.',
    content: `<p>The long-contested Dharavi Redevelopment Project has finally broken ground. Adani Realty, which won the ₹5,000-crore contract to redevelop Asia's most densely populated informal settlement, has begun the painstaking process of surveying, documenting, and relocating the first 10,000 families.</p>
<h2>A City Within a City</h2>
<p>Dharavi is not just a slum — it is a $1 billion informal economy. Its leather workshops, pottery kilns, recycling operations, and embroidery units form the backbone of Mumbai's manufacturing sector. Critics worry that formal redevelopment will destroy the organic industrial ecosystem that has evolved over 130 years.</p>
<h2>The Human Equation</h2>
<p>Of Dharavi's estimated 650,000 residents, only those who can prove residence before 2000 qualify for free housing. An estimated 150,000 newer residents — many of them migrant workers — face eviction without compensation. NGOs are challenging the cutoff date in the Bombay High Court.</p>`,
    categorySlug: 'viral',
    tags: ['Mumbai', 'Dharavi', 'redevelopment', 'housing'],
    isFeatured: false,
    isTrending: false,
    thumbnail: 'https://images.unsplash.com/photo-1567361672830-f7aa558930e3?w=1200&h=630&fit=crop',
    readTime: 6
  },
  {
    title: 'PhonePe\'s IPO: India\'s Most Anticipated Tech Listing Since Zomato',
    excerpt: 'Walmart-backed PhonePe files DRHP with SEBI for a potential $8 billion IPO. Here\'s everything investors need to know about India\'s leading payments super-app.',
    content: `<p>PhonePe, the Bengaluru-based fintech giant backed by Walmart and General Atlantic, has filed its Draft Red Herring Prospectus (DRHP) with SEBI, initiating the process for what could become India's largest tech IPO since LIC's 2022 listing.</p>
<h2>The Numbers</h2>
<p>PhonePe's DRHP reveals annual revenue of ₹5,064 crore, with the payments segment breaking even and the insurance distribution business growing at 180% year-on-year. The company commands a 48% share of UPI transactions by volume — making it larger than Google Pay, Paytm, and all other competitors combined.</p>
<h2>Beyond Payments</h2>
<p>The IPO narrative extends well beyond UPI processing fees, which are structurally zero in India. PhonePe has quietly built a formidable financial services stack: PhonePe Wealth, PhonePe Insurance, PhonePe Lending, and a hyperlocal discovery platform called Pincode. The bet is that once 500 million Indians trust PhonePe with their money movement, they will trust it with their financial lives.</p>`,
    categorySlug: 'business',
    tags: ['PhonePe', 'IPO', 'fintech', 'stock market'],
    isFeatured: true,
    isTrending: true,
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop',
    readTime: 5
  },
  {
    title: 'IIT Madras Startup Builds World\'s First Hindi Large Language Model',
    excerpt: 'A team of researchers from IIT Madras has built Bharati-7B, a 7 billion parameter LLM trained exclusively on Hindi and other Indian languages that outperforms GPT-3.5 on Hindi benchmarks.',
    content: `<p>A research-turned-startup spinout from IIT Madras has achieved what global AI giants have struggled with: a truly capable large language model for Hindi and other Indic languages. Bharati-7B, developed by Sarvam AI, has posted benchmark scores that surpass GPT-3.5 on Hindi-language tasks while running on a fraction of the compute.</p>
<h2>Why This Matters for India</h2>
<p>With over 600 million Hindi speakers and hundreds of millions more speaking Tamil, Telugu, Marathi, Bengali, and other Indic languages, the vast majority of India has been left behind by the AI revolution, which has been overwhelmingly English-centric. Bharati-7B changes that equation.</p>
<h2>The Training Approach</h2>
<p>Unlike models trained on English data and then fine-tuned, Bharati-7B was pre-trained from scratch on a corpus of 2 trillion Indic language tokens assembled from newspapers, books, government documents, and web data. The result is a model that understands Indian cultural context and idiom in a way English-first models simply cannot.</p>`,
    categorySlug: 'technology',
    tags: ['AI', 'Hindi', 'LLM', 'IIT Madras', 'Sarvam'],
    isFeatured: false,
    isTrending: true,
    thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=630&fit=crop',
    readTime: 5
  },
  {
    title: 'SEBI\'s New F&O Rules: How Retail Traders Lost ₹1.8 Lakh Crore in Derivatives',
    excerpt: 'SEBI releases explosive report showing 93% of retail F&O traders lost money in FY24, triggering sweeping new regulations to curb speculative trading.',
    content: `<p>A bombshell study released by the Securities and Exchange Board of India has revealed the staggering scale of retail losses in India's futures and options market. The report found that 93 out of every 100 individual traders in the derivatives segment lost money in FY24, with aggregate losses crossing ₹1.8 lakh crore.</p>
<h2>The Regulatory Response</h2>
<p>SEBI's new rules, which take effect in phases, include sharply higher contract lot sizes to deter small retail participation, mandatory risk disclosure during onboarding, intraday position limits, and a requirement for brokers to provide quarterly P&L statements to all F&O customers.</p>
<h2>The Broker Backlash</h2>
<p>India's discount brokerage industry — led by Zerodha, Groww, and Upstox — derives a significant portion of revenue from F&O transaction fees. Nithin Kamath of Zerodha has been surprisingly supportive of the curbs, stating publicly that "retail participation in F&O has been a societal harm," though competitors have been more guarded.</p>`,
    categorySlug: 'business',
    tags: ['SEBI', 'F&O', 'stock market', 'regulation', 'trading'],
    isFeatured: false,
    isTrending: false,
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630&fit=crop',
    readTime: 6
  },
  {
    title: 'Karnataka HC Ruling on OTT Censorship Sets National Precedent',
    excerpt: 'The Karnataka High Court strikes down government attempts to extend Cinematograph Act censorship powers to OTT platforms, in a landmark free speech judgment.',
    content: `<p>The Karnataka High Court has delivered a significant free speech victory, ruling that the Central Government cannot apply Cinematograph Act provisions to content on Over-The-Top platforms without fresh Parliamentary legislation. The judgment, delivered by a division bench, strikes down the challenged Information Technology (Intermediary Guidelines) amendments that would have required OTT content to obtain Censor Board clearance.</p>
<h2>Implications for Streaming Platforms</h2>
<p>The ruling is a major relief for Netflix, Amazon Prime Video, Disney+ Hotstar, and a constellation of Indian OTT platforms that had been operating under legal uncertainty. It affirms that existing OTT self-regulation frameworks under IAMAI are constitutionally valid.</p>`,
    categorySlug: 'law',
    tags: ['OTT', 'censorship', 'Karnataka HC', 'free speech'],
    isFeatured: false,
    isTrending: false,
    thumbnail: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=1200&h=630&fit=crop',
    readTime: 4
  },
  {
    title: 'Street Dog Saves Family from Gas Leak: Bengaluru\'s Viral Hero',
    excerpt: 'A stray dog named Bruno has become Bengaluru\'s most unlikely hero after alerting his adopted family to a gas leak that could have killed five people, including two children.',
    content: `<p>They say dogs can smell a thousand times better than humans. Bruno, a three-year-old mixed-breed stray who had been quietly adopted by the Krishnamurthy family in Bengaluru's Jayanagar neighborhood, proved it in the most dramatic way possible last Tuesday night.</p>
<h2>The Night Everything Changed</h2>
<p>At 2:30 AM, when the entire family of five was asleep, Bruno began barking frantically — behavior completely out of character for the typically gentle dog. He scratched at bedroom doors and refused to stop until every family member was awake. When they stumbled into the kitchen, they found a gas cylinder valve that had been accidentally left partially open for over two hours.</p>
<h2>Bruno Goes Viral</h2>
<p>The story, shared by family patriarch Suresh Krishnamurthy on Twitter with a photo of Bruno looking unbothered by his heroism, was retweeted 280,000 times. It has since prompted a citywide conversation about Bengaluru's relationship with its estimated 3 lakh stray dogs — and whether they deserve more humane treatment.</p>`,
    categorySlug: 'viral',
    tags: ['dog', 'viral', 'Bengaluru', 'hero'],
    isFeatured: false,
    isTrending: true,
    thumbnail: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&h=630&fit=crop',
    readTime: 3
  },
  {
    title: 'Ola Electric\'s Troubles: What Went Wrong with India\'s EV Dream',
    excerpt: 'Customer complaints, service center chaos, and a CCPA notice: Ola Electric\'s rapid rise has hit serious turbulence. An in-depth investigation into what went wrong.',
    content: `<p>Eighteen months ago, Ola Electric was the undisputed hero of India's electric vehicle story — a unicorn that had built the world's largest two-wheeler factory and was promising to make India an EV-first nation. Today, the company is fighting on multiple fronts: regulatory scrutiny, a flood of consumer complaints, and a stock that has fallen 60% from its IPO price.</p>
<h2>The Service Crisis</h2>
<p>At the heart of Ola Electric's problems is a service network that has catastrophically failed to keep pace with sales. The company sold 400,000 scooters in FY24 but operated fewer than 450 service centers nationwide — a ratio roughly one-fifth the industry standard. Social media is full of accounts of customers waiting 3-4 months for routine repairs.</p>
<h2>The CCPA Notice</h2>
<p>The Central Consumer Protection Authority issued Ola Electric a notice citing 10,000 unresolved consumer complaints, asking the company to explain why it should not be penalized. It is one of the largest consumer grievance actions against any company in Indian regulatory history.</p>`,
    categorySlug: 'business',
    tags: ['Ola Electric', 'EV', 'startup', 'consumer'],
    isFeatured: false,
    isTrending: false,
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop',
    readTime: 6
  },
];

const videoTemplates = [
  { title: 'Virat Kohli\'s Unbelievable Practice Drill Goes Viral', description: 'The Indian batting legend\'s net session footage had cricket fans worldwide in disbelief', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', videoType: 'youtube', categorySlug: 'viral', thumbnail: 'https://images.unsplash.com/photo-1540747913346-19212a4b423d?w=400&h=700&fit=crop' },
  { title: 'Inside India\'s Biggest Data Center: A ₹10,000 Crore Facility', description: 'Exclusive access inside the Adani Group\'s hyperscale data center in Navi Mumbai', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', videoType: 'youtube', categorySlug: 'technology', thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=700&fit=crop' },
  { title: 'Street Food Tour: Delhi\'s Old City After Midnight', description: 'The lanes of Chandni Chowk transform into a food paradise after 11 PM', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', videoType: 'youtube', categorySlug: 'viral', thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=700&fit=crop' },
  { title: 'Budget 2024 Explained in 60 Seconds', description: 'Everything you need to know about the Union Budget in under a minute', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', videoType: 'youtube', categorySlug: 'business', thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=700&fit=crop' },
  { title: 'ISRO Scientists Celebrate Chandrayaan Success: Raw Footage', description: 'The emotional moment India touched the Moon\'s south pole for the first time', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', videoType: 'youtube', categorySlug: 'technology', thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=700&fit=crop' },
  { title: 'Mumbai Local Train Rush Hour: The World\'s Busiest Railway', description: '47 million journeys a day — this is what peak hour looks like on India\'s lifeline', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', videoType: 'youtube', categorySlug: 'viral', thumbnail: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=700&fit=crop' },
  { title: 'How India\'s Supreme Court Works: Explained', description: 'A five-minute explainer on the world\'s most powerful constitutional court', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', videoType: 'youtube', categorySlug: 'law', thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=700&fit=crop' },
  { title: 'Zero to $1 Billion: The Zepto Story', description: 'How two 19-year-olds built India\'s fastest-growing startup in a Mumbai garage', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', videoType: 'youtube', categorySlug: 'business', thumbnail: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=700&fit=crop' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/newsplatform');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([User.deleteMany(), Category.deleteMany(), Article.deleteMany(), Video.deleteMany()]);
    console.log('🧹 Cleared existing data');

    // Create admin user — password will be hashed by pre-save hook
    const admin = new User({
      name: 'Admin User',
      email: 'admin@newsplatform.com',
      password: 'Admin@123',
      role: 'admin'
    });
    await admin.save();
    console.log('👤 Admin created: admin@newsplatform.com / Admin@123');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    const categoryMap = {};
    createdCategories.forEach(c => { categoryMap[c.slug] = c._id; });
    console.log('📂 Categories created:', createdCategories.map(c => c.name).join(', '));

    // Create articles
    for (const tmpl of articleTemplates) {
      const { categorySlug, ...rest } = tmpl;
      await Article.create({ ...rest, category: categoryMap[categorySlug], author: admin._id, status: 'published' });
    }
    console.log(`📰 ${articleTemplates.length} articles created`);

    // Create videos
    for (const tmpl of videoTemplates) {
      const { categorySlug, ...rest } = tmpl;
      await Video.create({ ...rest, category: categoryMap[categorySlug], author: admin._id, status: 'published' });
    }
    console.log(`🎥 ${videoTemplates.length} videos created`);

    console.log('\n✅ Seed complete!');
    console.log('🔑 Admin login: admin@newsplatform.com / Admin@123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
// This runs after the main seed - add default plans
