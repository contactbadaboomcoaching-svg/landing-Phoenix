import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Flame, Heart, Sparkles, Shield, Clock, Phone, Mail, User, Calendar, Euro, Star, ChevronRight, ArrowRight } from "lucide-react";

const Container = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

const SectionTitle = ({ eyebrow, title, subtitle, center = true }) => (
  <div className={`mb-10 ${center ? "text-center" : "text-left"}`}>
    {eyebrow && (
      <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-rose-600">
        <Flame className="h-4 w-4" /> {eyebrow}
      </p>
    )}
    <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
      {title}
    </h2>
    {subtitle && (
      <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
    )}
  </div>
);

const Badge = ({ children }) => (
  <span className="rounded-full bg-white/70 backdrop-blur px-3 py-1 text-xs font-semibold text-gray-700 ring-1 ring-black/5 shadow-sm">
    {children}
  </span>
);

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime();
      const distance = Math.max(0, targetDate - now);
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
}

export default function Home() {
  const target = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    d.setHours(9, 0, 0, 0);
    return d.getTime();
  }, []);
  const left = useCountdown(target);
  const earlyBirdDateStr = useMemo(() => {
    const d = new Date(target);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' });
  }, [target]);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", objective: "", budget: "",
    date: "", message: "", source: "", consent: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.consent) return alert("Merci d'accepter la politique de confidentialité.");
    try {
      localStorage.setItem("lead_phoenix", JSON.stringify({ ...form, createdAt: new Date().toISOString() }));
      await fetch('/api/brevo-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } catch (err) {
      console.error('Envoi Brevo échoué:', err);
    } finally {
      setSubmitted(true);
    }
  };

  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white text-gray-900 selection:bg-rose-200 selection:text-gray-900">
      {/* Top bar */}
      <div className="sticky top-0 z-50 border-b border-rose-100/80 bg-white/80 backdrop-blur">
        <Container className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-400 shadow ring-1 ring-black/5 grid place-items-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold leading-none">Badaboom Coaching</p>
              <p className="text-[11px] text-gray-500 leading-tight">Méthode Phoenix • Théâtre & Bien-être</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Badge>Places limitées (6 pers./journée)</Badge>
            <button onClick={scrollToForm} className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-rose-700 transition">
              Réserver ma place <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Container>
      </div>

      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-rose-200/60 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-amber-200/60 blur-3xl" />
        </div>
        <Container className="py-16 sm:py-20 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-3 py-1 text-xs font-semibold ring-1 ring-black/5 shadow-sm">
                <Heart className="h-4 w-4 text-rose-600" /> Libère tes émotions, transforme ta vie
              </div>
              <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1]">
                Renaître avec la <span className="bg-gradient-to-r from-rose-600 to-amber-500 bg-clip-text text-transparent">Méthode Phoenix</span>
              </h1>
              <p className="mt-5 text-base sm:text-lg text-gray-600 max-w-xl">
                Un accompagnement unique mêlant <strong>coaching</strong>, <strong>exercices de théâtre</strong>, méditations et rituels bien-être pour reprendre confiance, faire la paix avec le passé et oser ta nouvelle vie.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button onClick={scrollToForm} className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-white font-semibold shadow-lg hover:shadow-xl hover:bg-rose-700 transition">
                  Je postule maintenant <ChevronRight className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>Cadre bienveillant • Sans jugement</span>
                </div>
              </div>
              <div className="mt-8 grid w-full max-w-md grid-cols-4 overflow-hidden rounded-2xl bg-white/80 backdrop-blur ring-1 ring-black/5 shadow">
                {[{ label: "Jours", value: left.days }, { label: "Heures", value: left.hours }, { label: "Minutes", value: left.minutes }, { label: "Secondes", value: left.seconds }].map((t, i) => (
                  <div key={i} className="p-4 text-center">
                    <div className="text-3xl font-extrabold tabular-nums">{String(t.value).padStart(2, "0")}</div>
                    <div className="text-xs tracking-wider text-gray-500 uppercase">{t.label}</div>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Prochain groupe intime — places très limitées. Candidatures priorisées dans l'ordre d'arrivée.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
              <div className="relative">
                <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-tr from-rose-300 via-amber-200 to-transparent blur-2xl opacity-80" />
                <div className="relative rounded-[2rem] bg-white p-6 sm:p-8 shadow-xl ring-1 ring-black/5">
                  <div className="flex items-center gap-2 text-rose-600 text-sm font-semibold">
                    <Flame className="h-4 w-4" /> Méthode Phoenix — 4 piliers
                  </div>
                  <ul className="mt-4 space-y-3 text-sm sm:text-base">
                    {["Faire la paix avec ton passé et tes traumas","Apprendre à t'aimer et te revaloriser","Exprimer et réguler tes émotions (sans les refouler)","Retrouver confiance, légèreté et autonomie"].map((text, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-600" />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 grid grid-cols-2 gap-3 text-center text-xs text-gray-600">
                    <div className="rounded-xl bg-gray-50 p-3 ring-1 ring-black/5">
                      <Clock className="mx-auto mb-1 h-4 w-4" />
                      Formats: journées & coaching
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3 ring-1 ring-black/5">
                      <User className="mx-auto mb-1 h-4 w-4" />
                      Groupes intimes (max 6)
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </header>

      {/* Pain / Build */}
      <section>
        <Container className="py-12 sm:py-16">
          <SectionTitle
            eyebrow="Tu n'es pas seule"
            title="Si tu te reconnais ici, tu es au bon endroit"
            subtitle="Stress, anxiété, troubles du sommeil ou alimentaires, perte de confiance, sensation de vivre pour les autres… Tu as essayé des méthodes sans résultat durable."
          />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/5">
              <h3 className="mb-4 text-lg font-bold">Ce que tu vis peut ressembler à…</h3>
              <ul className="space-y-3 text-gray-700">
                {[
                  "Tu t'oublies et vis par procuration",
                  "Tu doutes de ta valeur et te dévalorises",
                  "Tu refoules tes émotions par peur de déranger",
                  "Tu te sens bloquée malgré les thérapies déjà tentées",
                ].map((it, i) => (
                  <li key={i} className="flex items-start gap-3"><X className="mt-1 h-5 w-5 text-rose-500" /><span>{it}</span></li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/5">
              <h3 className="mb-4 text-lg font-bold">Ce que nous allons bâtir ensemble</h3>
              <ul className="space-y-3 text-gray-700">
                {[
                  "Un espace sécurisé pour exprimer tes émotions",
                  "Des outils concrets (théâtre, respiration, rituels)",
                  "Une image de toi réconciliée et fière",
                  "Une confiance apaisée, durable et autonome",
                ].map((it, i) => (
                  <li key={i} className="flex items-start gap-3"><Check className="mt-1 h-5 w-5 text-emerald-600" /><span>{it}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Offre */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-rose-50/60 to-white" />
        <Container className="py-12 sm:py-16">
          <SectionTitle
            eyebrow="Offre Phoenix"
            title="Journées bien-être & accompagnements sur-mesure"
            subtitle="Des expériences immersives pour renaître en douceur."
          />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="relative rounded-3xl bg-white p-7 shadow-xl ring-1 ring-black/5">
              <div className="absolute right-6 top-6">
                <Badge>6 places par édition</Badge>
              </div>
              <div className="flex items-center gap-2 text-rose-600 text-sm font-semibold">
                <Flame className="h-4 w-4" /> Journée bien-être Phoenix — 1 journée
              </div>
              <p className="mt-3 text-gray-600">
                Théâtre, méditations guidées, exercices ludiques, temps nature et shooting photo symbolique pour ancrer ta transformation.
              </p>
              <div className="mt-5 flex items-end gap-3">
                <span className="text-3xl font-extrabold">150€</span>
                <span className="text-sm text-gray-500">/ journée — repas partagé</span>
              </div>
              <ul className="mt-5 space-y-3 text-sm text-gray-700">
                {[`Groupe intime et bienveillant`,`Lieu en nature (communiqué après inscription)`,`Repas partagé (auberge espagnole)`,`Early bird 120€ jusqu'au ${earlyBirdDateStr}`].map((b, i) => (
                  <li key={i} className="flex items-start gap-3"><Check className="mt-1 h-5 w-5 text-emerald-600" /><span>{b}</span></li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button onClick={scrollToForm} className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-white font-semibold shadow hover:bg-rose-700">
                  Je réserve / Je candidate <ArrowRight className="h-5 w-5" />
                </button>
                <div className="text-xs text-gray-500">Sélection pour préserver l'intimité du groupe</div>
              </div>
            </div>

            <div className="relative rounded-3xl bg-white p-7 shadow-xl ring-1 ring-black/5">
              <div className="absolute right-6 top-6">
                <Badge>Sur candidature</Badge>
              </div>
              <div className="flex items-center gap-2 text-rose-600 text-sm font-semibold">
                <Heart className="h-4 w-4" /> Coaching Phoenix — accompagnement 1:1
              </div>
              <p className="mt-3 text-gray-600">
                Trajet personnalisé pour apaiser, reconstruire et rayonner. Idéal si tu préfères un suivi individuel intensif.
              </p>
              <div className="mt-5 flex items-end gap-3">
                <span className="text-3xl font-extrabold">Sur devis</span>
                <span className="text-sm text-gray-500">selon durée & objectifs</span>
              </div>
              <ul className="mt-5 space-y-3 text-sm text-gray-700">
                {["Plan sur-mesure (émotions, image, routines)","Sessions visio + exercices guidés","Accès prioritaire par messagerie","Travail photo possible (reconquête de l'image)"].map((b, i) => (
                  <li key={i} className="flex items-start gap-3"><Check className="mt-1 h-5 w-5 text-emerald-600" /><span>{b}</span></li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button onClick={scrollToForm} className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-5 py-3 text-white font-semibold shadow hover:bg-black">
                  Candidater maintenant <ArrowRight className="h-5 w-5" />
                </button>
                <div className="text-xs text-gray-500">Pour personnes prêtes à s'investir</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Témoignages */}
      <section>
        <Container className="py-12 sm:py-16">
          <SectionTitle
            eyebrow="Ce qu'on dit de l'expérience"
            title="Des transformations réelles et durables"
            subtitle="Ces retours reflètent les effets concrets des outils (théâtre, respiration, rituels). Remplace par tes témoignages réels dès que possible."
          />
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { name: 'Claire', age: 28, text: "J'ai osé prendre ma place, je me sens enfin légitime." },
              { name: 'François', age: 32, text: "J'ai découvert des outils simples pour calmer mes angoisses." },
              { name: 'Julien', age: 41, text: "J'ai retrouvé confiance et de la légèreté dans mon quotidien." },
              { name: 'Lise', age: 24, text: "J'ai appris à m'aimer et à poser mes limites sans culpabiliser." },
            ].map((t, i) => (
              <div key={i} className="rounded-3xl bg-white p-6 shadow ring-1 ring-black/5">
                <div className="mb-3 flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, idx) => <Star key={idx} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-sm text-gray-700">« {t.text} »</p>
                <p className="mt-4 text-xs font-medium text-gray-500">— {t.name}, {t.age} ans</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Qualif */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-amber-50/60 to-white" />
        <Container className="py-12 sm:py-16">
          <SectionTitle
            eyebrow="Candidature"
            title="Avant de postuler, lis ceci"
            subtitle="Je m'engage pleinement. En retour, j'attends des personnes prêtes à s'investir émotionnellement et financièrement."
          />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/5">
              <h3 className="mb-3 text-lg font-bold">C'est pour toi si…</h3>
              <ul className="space-y-3 text-gray-700">
                {[
                  "Tu veux un changement réel, pas une solution miracle",
                  "Tu es prête/prêt à appliquer des outils entre les sessions",
                  "Tu respectes le cadre et la confidentialité du groupe",
                  "Tu es OK pour investir dans toi (argent, temps, cœur)",
                ].map((it, i) => (
                  <li key={i} className="flex items-start gap-3"><Check className="mt-1 h-5 w-5 text-emerald-600" /><span>{it}</span></li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/5">
              <h3 className="mb-3 text-lg font-bold">Ce n'est pas pour toi si…</h3>
              <ul className="space-y-3 text-gray-700">
                {[
                  "Tu veux un résultat sans implication personnelle",
                  "Tu refuses d'exprimer tes émotions même en sécurité",
                  "Tu recherches des séances purement théoriques",
                  "Tu n'es pas prête/prêt à te prioriser maintenant",
                ].map((it, i) => (
                  <li key={i} className="flex items-start gap-3"><X className="mt-1 h-5 w-5 text-rose-500" /><span>{it}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Formulaire */}
      <section id="lead-form">
        <Container className="py-12 sm:py-16">
          <SectionTitle
            eyebrow="Candidature prioritaire"
            title="Dis-moi qui tu es et ce dont tu as besoin"
            subtitle="Réponds en toute sincérité. Réponse rapide avec les prochaines étapes si nos valeurs matchent."
          />
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl ring-1 ring-black/5">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Prénom*</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input required name="name" value={form.name} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="Ton prénom" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Email*</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input required type="email" name="email" value={form.email} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="ton@email.fr" />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Téléphone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input name="phone" value={form.phone} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="06 12 34 56 78" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Budget prêt à investir*</label>
                      <div className="relative">
                        <Euro className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <select required name="budget" value={form.budget} onChange={handleChange} className="w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-8 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500">
                          <option value="">Sélectionne…</option>
                          <option>≤ 300€</option>
                          <option>300€ – 550€</option>
                          <option>550€ – 1000€</option>
                          <option>1000€ +</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Ton objectif principal*</label>
                    <select required name="objective" value={form.objective} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500">
                      <option value="">Choisir…</option>
                      <option>Reprendre confiance & estime de soi</option>
                      <option>Apaiser anxiété / sommeil</option>
                      <option>Faire la paix avec mon passé</option>
                      <option>Exprimer mes émotions et ma voix</option>
                      <option>Autre (je détaille ci-dessous)</option>
                    </select>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Disponibilité souhaitée</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Comment as-tu connu Badaboom ?</label>
                      <input name="source" value={form.source} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="TikTok, Insta, bouche-à-oreille, autre…" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Dis-m'en plus (facultatif)</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={4} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500" placeholder="Ta situation actuelle, ce que tu attends, ce que tu as déjà essayé…" />
                  </div>
                  <div className="flex items-start gap-3">
                    <input id="consent" type="checkbox" name="consent" checked={form.consent} onChange={handleChange} className="mt-1 h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                    <label htmlFor="consent" className="text-xs text-gray-600">
                      J'accepte la <a href="#rgpd" className="underline">politique de confidentialité</a> et je consens à être contacté·e au sujet de ma candidature.
                    </label>
                  </div>
                  <div className="pt-2">
                    <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 px-6 py-3 text-white font-semibold shadow-lg hover:bg-rose-700">
                      Envoyer ma candidature <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Astuce : plus tu es précise dans tes réponses, plus je peux t'aider.</p>
                </form>
              ) : (
                <div className="text-center">
                  <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
                    <Check className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-extrabold">Candidature bien reçue ✨</h3>
                  <p className="mt-2 text-gray-600">Merci pour ta confiance. Je reviens vers toi rapidement avec les prochaines étapes.</p>
                  <div className="mt-6">
                    <button onClick={() => setSubmitted(false)} className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">Envoyer une autre candidature</button>
                  </div>
                </div>
              )}
            </div>

            {/* Why me */}
            <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl ring-1 ring-black/5">
              <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
                <Sparkles className="h-4 w-4" /> Pourquoi Badaboom / Juliette ?
              </div>
              <h3 className="mt-4 text-2xl font-extrabold">20 ans de théâtre & un chemin de résilience</h3>
              <p className="mt-3 text-gray-700">
                Je suis <strong>Juliette</strong>, coach & metteuse en mouvement émotionnel. J'ai surmonté des traumas et créé la <strong>Méthode Phoenix</strong> : un cadre concret, doux mais exigeant, pour te permettre de renaître et d'exister par toi-même.
              </p>
              <ul className="mt-5 space-y-3 text-sm text-gray-700">
                {["Approche intégrative (théâtre, respiration, rituels, photo)","Sécurité émotionnelle & bienveillance sans complaisance","Outils applicables au quotidien pour des effets durables","Groupes intimes pour un accompagnement profond"].map((it, i) => (
                  <li key={i} className="flex items-start gap-3"><Check className="mt-1 h-5 w-5 text-emerald-600" /><span>{it}</span></li>
                ))}
              </ul>
              <div className="mt-6 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600 ring-1 ring-black/5">
                <Shield className="mb-2 h-5 w-5" />
                <p>
                  <strong>Mon engagement :</strong> pas de promesse miracle. Des outils puissants, une écoute réelle et un cadre qui protège.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section>
        <Container className="py-12 sm:py-16">
          <SectionTitle eyebrow="FAQ" title="Tes questions, mes réponses" />
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                q: "Je suis très timide, le théâtre me fait peur…",
                a: "Justement : on ne joue pas à être quelqu'un d'autre. On utilise des exercices simples pour libérer la voix, l'ancrage et l'expression, dans un cadre sécurisé.",
              },
              {
                q: "Est-ce que c'est remboursé ?",
                a: "Non. C'est un investissement personnel. Des facilités de paiement sont possibles sur demande.",
              },
              {
                q: "Je viens seule, est-ce que je vais me sentir à l'aise ?",
                a: "Oui. Les groupes sont petits et bienveillants. L'objectif est de te sentir en sécurité émotionnelle.",
              },
              {
                q: "Et si je n'aime pas les méditations ?",
                a: "Tu restes actrice/acteur de ton rythme. On adapte. L'idée n'est pas d'imposer, mais de t'équiper.",
              },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl bg-white p-6 shadow ring-1 ring-black/5">
                <h4 className="text-lg font-bold">{item.q}</h4>
                <p className="mt-2 text-gray-700">{item.a}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-200 bg-white" id="rgpd">
        <Container className="py-10">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-400 shadow ring-1 ring-black/5 grid place-items-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold leading-none">Badaboom Coaching</p>
                <p className="text-[11px] text-gray-500 leading-tight">Méthode Phoenix — © {new Date().getFullYear()}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 max-w-xl">
              Les informations collectées sont utilisées uniquement pour te recontacter au sujet de ta candidature et t'envoyer des informations utiles. Conformément au RGPD, tu peux demander l'accès, la rectification ou la suppression de tes données à tout moment.
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500">
            <a className="underline" href="#">Mentions légales</a>
            <span>•</span>
            <a className="underline" href="#">Politique de confidentialité</a>
            <span>•</span>
            <a className="underline" href="#">CGV</a>
          </div>
        </Container>

        <div className="fixed inset-x-0 bottom-4 z-40 mx-auto w-[92%] sm:hidden">
          <div className="rounded-2xl bg-white/90 backdrop-blur p-3 shadow-2xl ring-1 ring-black/5">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm">
                <div className="font-bold">Prête à renaître ?</div>
                <div className="text-gray-500">Places limitées — candidature rapide</div>
              </div>
              <button onClick={scrollToForm} className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-rose-700">
                Postuler <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
