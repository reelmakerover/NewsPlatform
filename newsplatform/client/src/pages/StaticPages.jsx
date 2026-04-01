import { motion } from 'framer-motion'
import SEOHead from '../components/common/SEOHead'

export function AboutPage() {
  const team = [
    { name: 'Arjun Sharma', role: 'Editor-in-Chief', emoji: '👨‍💼' },
    { name: 'Priya Mehta', role: 'Technology Editor', emoji: '👩‍💻' },
    { name: 'Rahul Gupta', role: 'Business Reporter', emoji: '📊' },
    { name: 'Anjali Singh', role: 'Legal Correspondent', emoji: '⚖️' },
  ]

  return (
    <>
      <SEOHead title="About Us" description="IndiaInk is premium journalism for modern India." />
      <div className="pb-20">
        <div className="bg-ink-900 text-white">
          <div className="container-wide py-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
              <p className="font-body text-crimson-400 text-sm font-medium uppercase tracking-widest mb-4">About IndiaInk</p>
              <h1 className="font-display text-5xl font-bold mb-6 leading-tight">Journalism that respects your intelligence.</h1>
              <p className="font-body text-ink-300 text-lg leading-relaxed">
                IndiaInk is a digital-first media platform covering technology, business, culture, and law in India. We believe in depth over volume — every story we publish is researched, reported, and written to give you genuine insight.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container-wide py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: '📰', title: 'Original Reporting', desc: 'Every story is independently reported and verified by our editorial team before publication.' },
              { icon: '🔍', title: 'Deep Analysis', desc: 'We go beyond headlines to explain the context, the stakes, and what it means for you.' },
              { icon: '🇮🇳', title: 'India-First', desc: 'Our coverage is rooted in India — its economy, its laws, its culture, and its ambitions.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-ink-100">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="font-display text-xl font-bold text-ink-900 mb-2">{item.title}</h3>
                <p className="font-body text-ink-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <h2 className="font-display text-3xl font-bold text-ink-900 mb-8">Our Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {team.map((member, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center border border-ink-100 card-hover">
                <span className="text-5xl mb-4 block">{member.emoji}</span>
                <h3 className="font-display text-base font-bold text-ink-900">{member.name}</h3>
                <p className="font-body text-xs text-ink-400 mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export function ContactPage() {
  return (
    <>
      <SEOHead title="Contact Us" description="Get in touch with the IndiaInk editorial team." />
      <div className="container-narrow py-16 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl font-bold text-ink-900 mb-3">Get in touch</h1>
          <p className="font-body text-ink-500 mb-10">News tips, corrections, partnerships, or feedback — we'd love to hear from you.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.form initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="space-y-5 bg-white p-8 rounded-2xl border border-ink-100"
            onSubmit={e => { e.preventDefault(); alert('Message sent! (Connect to backend to enable)') }}>
            {[
              { label: 'Your Name', id: 'name', type: 'text', placeholder: 'Rahul Sharma' },
              { label: 'Email Address', id: 'email', type: 'email', placeholder: 'rahul@example.com' },
              { label: 'Subject', id: 'subject', type: 'text', placeholder: 'News tip / Feedback / Partnership' },
            ].map(f => (
              <div key={f.id}>
                <label htmlFor={f.id} className="font-body text-sm font-medium text-ink-700 block mb-1.5">{f.label}</label>
                <input id={f.id} type={f.type} placeholder={f.placeholder} required
                  className="w-full h-11 px-4 bg-ink-50 border border-ink-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-transparent transition-all" />
              </div>
            ))}
            <div>
              <label htmlFor="message" className="font-body text-sm font-medium text-ink-700 block mb-1.5">Message</label>
              <textarea id="message" rows={5} required placeholder="Your message..."
                className="w-full px-4 py-3 bg-ink-50 border border-ink-200 rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-transparent transition-all resize-none" />
            </div>
            <button type="submit" className="btn-primary w-full justify-center py-3">Send Message</button>
          </motion.form>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
            {[
              { icon: '📧', title: 'Editorial', email: 'editorial@indiaink.com', desc: 'News tips, corrections, story pitches' },
              { icon: '🤝', title: 'Partnerships', email: 'partnerships@indiaink.com', desc: 'Content and brand collaborations' },
              { icon: '⚖️', title: 'Legal', email: 'legal@indiaink.com', desc: 'Takedown requests, legal notices' },
            ].map((c, i) => (
              <div key={i} className="flex gap-4 p-5 bg-white rounded-2xl border border-ink-100">
                <span className="text-2xl shrink-0">{c.icon}</span>
                <div>
                  <h3 className="font-display text-base font-bold text-ink-900">{c.title}</h3>
                  <a href={`mailto:${c.email}`} className="font-body text-sm text-crimson-500 hover:underline block mt-0.5">{c.email}</a>
                  <p className="font-body text-xs text-ink-400 mt-1">{c.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  )
}
