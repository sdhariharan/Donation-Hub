import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Gift,
  HeartHandshake,
  ListChecks,
  SearchCheck,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { APP_ROUTES } from '../common/constants'

const STEPS = [
  {
    icon: <Building2 className="h-6 w-6" aria-hidden="true" />,
    title: 'Organizations publish needs',
    description: 'Needs, urgency, inventory, and accepted categories make real demand visible.',
  },
  {
    icon: <Gift className="h-6 w-6" aria-hidden="true" />,
    title: 'Donors offer useful items',
    description: 'Donors create a donation once and see organizations equipped to use it.',
  },
  {
    icon: <SearchCheck className="h-6 w-6" aria-hidden="true" />,
    title: 'Kindred explains the match',
    description: 'Every recommendation shows its need, inventory, distance, and trust score.',
  },
]

const LIFECYCLE = [
  'Uploaded',
  'Accepted',
  'Ready for Pickup',
  'Received',
  'Completed',
]

function LandingPage() {
  return (
    <div className="w-full overflow-hidden bg-kindred-cream">
      <section className="relative border-b border-orange-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,139,36,0.18),transparent_38%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-orange-200 bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-kindred-orange-dark">
              Demand-first donation platform
            </p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
              Connecting the right donation to the{' '}
              <span className="text-kindred-orange-dark">right recipient.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Organizations publish what they genuinely need. Donors respond to
              real demand with transparent matching, end-to-end tracking, and
              measurable impact.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={APP_ROUTES.REGISTER}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-kindred-orange px-5 py-3 font-semibold text-slate-950 shadow-sm transition hover:bg-kindred-orange-dark hover:text-white"
              >
                Join Kindred
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-xl border border-orange-200 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:bg-kindred-cream"
              >
                See how it works
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-xl shadow-orange-900/5 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-kindred-orange p-3 text-slate-950">
                <HeartHandshake className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <p className="font-bold text-slate-950">Purpose before volume</p>
                <p className="text-sm text-slate-500">A clearer path from need to impact</p>
              </div>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                ['Published demand', 'Needs guide every match'],
                ['Transparent scores', 'No black-box recommendations'],
                ['Visible progress', 'Five clear lifecycle stages'],
                ['Real outcomes', 'Completed donations drive impact'],
              ].map(([title, description]) => (
                <div key={title} className="rounded-2xl bg-kindred-cream p-4">
                  <CheckCircle2 className="h-5 w-5 text-kindred-orange-dark" aria-hidden="true" />
                  <p className="mt-3 font-semibold text-slate-900">{title}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-kindred-orange-dark">The problem</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                Generosity works better when demand comes first.
              </h2>
            </div>
            <p className="text-lg leading-8 text-slate-600">
              Uncoordinated donations can create storage pressure and leave
              urgent needs unanswered. Kindred gives organizations a structured
              way to publish demand, then helps donors make an informed,
              accountable choice.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-20 bg-kindred-cream">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-kindred-orange-dark">How Kindred works</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">A practical path from need to receipt.</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map(({ icon, title, description }, index) => (
              <article key={title} className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-kindred-cream p-3 text-kindred-orange-dark">
                    {icon}
                  </div>
                  <span className="text-sm font-bold text-orange-300">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <article className="rounded-3xl bg-slate-950 p-7 text-white sm:p-9">
            <Gift className="h-7 w-7 text-kindred-orange" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-bold">For donors</h2>
            <p className="mt-3 leading-7 text-slate-300">
              Create donations, understand each recommendation, choose an
              organization, follow receipt, and see completed impact.
            </p>
          </article>
          <article className="rounded-3xl border border-orange-100 bg-kindred-cream p-7 sm:p-9">
            <Users className="h-7 w-7 text-kindred-orange-dark" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-bold text-slate-950">For organizations</h2>
            <p className="mt-3 leading-7 text-slate-600">
              Publish current needs, maintain inventory, receive suitable
              donations, update their lifecycle, and report measurable outcomes.
            </p>
          </article>
        </div>
      </section>

      <section className="bg-kindred-cream">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <ListChecks className="h-7 w-7 text-kindred-orange-dark" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-bold text-slate-950">Transparent by design</h2>
            <p className="mt-4 leading-7 text-slate-600">
              Recommendations use fixed, visible factors: active need, current
              inventory, location, and organization trust. Scores are
              deterministic and rule-based—not AI.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-kindred-orange-dark">Donation lifecycle</p>
            <ol className="mt-5 grid gap-3">
              {LIFECYCLE.map((status, index) => (
                <li key={status} className="flex items-center gap-4 rounded-xl bg-white px-4 py-3 shadow-sm">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-kindred-orange text-sm font-bold text-slate-950">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-slate-800">{status}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <BarChart3 className="mx-auto h-8 w-8 text-kindred-orange-dark" aria-hidden="true" />
          <h2 className="mt-4 text-3xl font-bold text-slate-950">Impact grounded in completed donations</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Both roles can see donation status, categories, completed item
            totals, recent history, and the people or organizations reached.
          </p>
        </div>
      </section>

      <section className="bg-slate-950">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white">Ready to make the next donation count?</h2>
          <p className="mt-4 text-slate-300">Join as a donor or organization and start with real demand.</p>
          <Link
            to={APP_ROUTES.REGISTER}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-kindred-orange px-5 py-3 font-semibold text-slate-950 transition hover:bg-white"
          >
            Create an account
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
