import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useUserAuth } from '../context/UserAuthContext'
import SEOHead from '../components/common/SEOHead'
import api from '../utils/api'
import toast from 'react-hot-toast'

function PlanCard({ plan, index, onSubscribe, currentPlan, loading }) {
  const isCurrent = currentPlan === plan.slug
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
      className={`relative bg-white rounded-2xl border-2 p-7 flex flex-col ${plan.isPopular ? 'border-crimson-500 shadow-xl shadow-crimson-100' : 'border-ink-100'}`}>
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-crimson-500 text-white text-xs font-body font-semibold px-4 py-1 rounded-full">
          ⭐ Sabse Popular
        </div>
      )}
      {isCurrent && (
        <div className="absolute -top-3 right-4 bg-green-500 text-white text-xs font-body font-semibold px-4 py-1 rounded-full">
          ✅ Active Plan
        </div>
      )}

      <div className="mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3" style={{ backgroundColor: plan.color + '20' }}>
          {plan.slug === 'free' ? '🆓' : plan.slug === 'basic' ? '⚡' : plan.slug === 'premium' ? '👑' : '🏆'}
        </div>
        <h3 className="font-display text-xl font-bold text-ink-900">{plan.name}</h3>
        <p className="font-body text-sm text-ink-500 mt-1">{plan.description}</p>
      </div>

      <div className="mb-6">
        {plan.price === 0 ? (
          <div className="font-display text-4xl font-bold text-ink-900">Free</div>
        ) : (
          <div className="flex items-end gap-1">
            <span className="font-display text-4xl font-bold text-ink-900">₹{plan.price}</span>
            <span className="font-body text-sm text-ink-400 mb-1.5">/{plan.duration} days</span>
          </div>
        )}
        {plan.price > 0 && (
          <p className="font-body text-xs text-ink-400 mt-1">
            = ₹{(plan.price / plan.duration).toFixed(1)}/day
          </p>
        )}
      </div>

      <ul className="space-y-2.5 flex-1 mb-7">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-center gap-2.5 font-body text-sm text-ink-700">
            <span className="text-green-500 shrink-0">✓</span>
            {f}
          </li>
        ))}
      </ul>

      <button onClick={() => onSubscribe(plan)} disabled={isCurrent || plan.price === 0 || loading}
        className={`w-full py-3 rounded-xl font-body font-medium text-sm transition-all ${
          isCurrent ? 'bg-green-50 text-green-600 cursor-default' :
          plan.price === 0 ? 'bg-ink-100 text-ink-400 cursor-default' :
          plan.isPopular ? 'bg-crimson-500 hover:bg-crimson-600 text-white shadow-lg hover:-translate-y-0.5' :
          'bg-ink-900 hover:bg-ink-800 text-white'
        }`}>
        {isCurrent ? '✅ Current Plan' : plan.price === 0 ? 'Free Plan' : loading ? '⏳ Processing...' : `Subscribe — ₹${plan.price}`}
      </button>
    </motion.div>
  )
}

export default function PricingPage() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(false)
  const { user, isPremium, refreshUser } = useUserAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/payment/plans').then(d => setPlans(d.plans || [])).catch(console.error)
  }, [])

  const handleSubscribe = async (plan) => {
    if (!user) { navigate('/login'); toast('Pehle login karo!'); return }
    setLoading(true)
    try {
      const data = await api.post('/payment/create-order', { planId: plan._id })

      // Load Razorpay script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      document.body.appendChild(script)
      script.onload = () => {
        const options = {
          key: data.key,
          amount: data.order.amount,
          currency: 'INR',
          name: 'IndiaInk',
          description: `${plan.name} Subscription`,
          order_id: data.order.id,
          prefill: { name: data.user.name, email: data.user.email, contact: data.user.phone },
          theme: { color: '#E03535' },
          handler: async (response) => {
            try {
              const verify = await api.post('/payment/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: plan._id
              })
              await refreshUser()
              toast.success(verify.message || '🎉 Subscription active ho gaya!')
              navigate('/')
            } catch (err) {
              toast.error('Payment verify nahi hua: ' + err.message)
            }
          },
          modal: { ondismiss: () => setLoading(false) }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
        setLoading(false)
      }
    } catch (err) {
      toast.error(err.message || 'Order create nahi hua')
      setLoading(false)
    }
  }

  const currentPlan = user?.subscription?.plan || 'free'

  return (
    <>
      <SEOHead title="Subscription Plans" description="IndiaInk ke premium plans — India ki best journalism, seedha aapke paas" />
      <div className="pb-20">
        {/* Hero */}
        <div className="bg-ink-900 text-white py-16 px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Premium Journalism,<br /><span className="text-crimson-400">Affordable Price</span>
            </h1>
            <p className="font-body text-ink-300 text-lg">
              Ek chai ki kimat mein — India ka sabse accha news platform
            </p>
            {user && isPremium() && (
              <div className="mt-6 inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 px-5 py-2.5 rounded-full font-body text-sm">
                ✅ Aap already premium member ho!
              </div>
            )}
          </motion.div>
        </div>

        {/* Plans grid */}
        <div className="max-w-6xl mx-auto px-4 -mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((plan, i) => (
              <PlanCard key={plan._id} plan={plan} index={i} onSubscribe={handleSubscribe}
                currentPlan={currentPlan} loading={loading} />
            ))}
          </div>
        </div>

        {/* Trust signals */}
        <div className="max-w-3xl mx-auto px-4 mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: '🔒', title: 'Secure Payment', desc: 'Razorpay se secured — UPI, Card, NetBanking sab chalega' },
              { icon: '↩️', title: 'Easy Cancel', desc: 'Kisi bhi waqt cancel kar sakte ho, koi sawaal nahi' },
              { icon: '📞', title: '24/7 Support', desc: 'Koi bhi problem ho toh hum hain' },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-ink-100 p-5 text-center">
                <span className="text-3xl mb-3 block">{t.icon}</span>
                <p className="font-display text-base font-bold text-ink-900">{t.title}</p>
                <p className="font-body text-xs text-ink-500 mt-1">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto px-4 mt-16">
          <h2 className="font-display text-2xl font-bold text-ink-900 text-center mb-8">Aksar Pooche Jane Wale Sawaal</h2>
          <div className="space-y-4">
            {[
              { q: 'Payment kaise karu?', a: 'Razorpay se — UPI (PhonePe, GPay, Paytm), Debit/Credit Card, Net Banking sab accept karte hain.' },
              { q: 'Free plan mein kya milega?', a: 'Breaking news, latest articles, video reels — sab basic content free mein padh sakte ho.' },
              { q: 'Cancel kaise karu?', a: 'Subscription automatically renew nahi hota. Jo days baaki hain wo milenge, uske baad free plan mein aa jaoge.' },
              { q: 'Refund milega?', a: 'Technical issue ya duplicate payment pe 7 din mein full refund. support@indiaink.com pe email karo.' },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-ink-100 p-5">
                <p className="font-display text-base font-bold text-ink-900 mb-1">{faq.q}</p>
                <p className="font-body text-sm text-ink-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
