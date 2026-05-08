import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Eye, Users, Award, Shield, CheckCircle2, ChevronLeft, ChevronRight, MapPin, HardHat } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SectionHeading } from '@/components/ui/section-heading';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/animations/ScrollAnimations';
import { PageLoader } from '@/components/ui/loader';
import { Skeleton } from '@/components/ui/skeleton';
import { aboutAPI } from '@/lib/api';
import aboutImage from '@/assets/about-industrial.jpg';
import servicesPiping from '@/assets/services-piping.jpg';
import servicesCrane from '@/assets/services-crane.jpg';
import founderImage from '@/assets/founder.jpeg';

// Skeleton components
const HeroSkeleton = () => (
  <div className="max-w-3xl mx-auto text-center">
    <Skeleton className="h-8 w-32 rounded-full mx-auto mb-6" />
    <Skeleton className="h-16 w-full mb-6" />
    <Skeleton className="h-6 w-full mb-2" />
    <Skeleton className="h-6 w-2/3 mx-auto" />
  </div>
);

const ContentSkeleton = () => (
  <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
    <Skeleton className="rounded-2xl w-full aspect-[4/3]" />
    <div className="space-y-4">
      <Skeleton className="h-10 w-48 mb-6" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

const MDMessageSkeleton = () => (
  <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      <div>
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="space-y-3 border-l-4 border-muted pl-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <Skeleton className="rounded-2xl w-full aspect-[3/4]" />
    </div>
  </div>
);

const SafetyEventSkeleton = () => (
  <div className="bg-card border border-border rounded-2xl overflow-hidden h-full flex flex-col">
    <Skeleton className="aspect-[16/9] w-full" />
    <div className="p-6 space-y-4">
      <Skeleton className="h-6 w-24 rounded-full" />
      <Skeleton className="h-7 w-full" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <div className="space-y-2 pt-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  </div>
);

const MeetingCardSkeleton = () => (
  <div className="bg-card border border-border rounded-2xl p-6 h-full flex flex-col">
    <div className="flex items-start justify-between mb-4">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    <Skeleton className="h-7 w-3/4 mb-2" />
    <Skeleton className="h-4 w-full mb-4" />
    <div className="space-y-2 mb-4 flex-1">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
    </div>
    <Skeleton className="h-4 w-1/2 pt-3 border-t border-border" />
  </div>
);

const TrainingCardSkeleton = () => (
  <div className="text-center p-6 rounded-2xl bg-card border border-border h-full flex flex-col items-center">
    <Skeleton className="w-16 h-16 rounded-full mb-4" />
    <Skeleton className="h-6 w-16 rounded-full mb-3" />
    <Skeleton className="h-7 w-3/4 mb-2" />
    <Skeleton className="h-4 w-full" />
  </div>
);

// Icon mapping for values
const iconMap: Record<string, any> = {
  Shield,
  Target,
  Users,
  Award,
  HardHat,
};

// Certifications & awards (from Essar Steel, EHESL, National Safety Day, etc.)
const certificationCards = [
  {
    title: 'Contractor Safety Performance Award',
    year: '2018',
    achievement: 'Second Prize for Contractors Safety Performance Award',
    recipient: 'M/s. Babu Erectors Pvt. Ltd.',
    occasion: '1st Steel Safety Day & 48th National Safety Day',
    date: '28th March 2019',
    issuer: 'Essar Steel India Limited, Hazira',
  },
  {
    title: 'Certificate of Appreciation',
    year: '2018-19',
    achievement: 'Winner amongst all contractors for Best HSE Conscious Contractor',
    recipient: 'M/s Babu Erectors Pvt. Ltd.',
    occasion: 'at EHESL Hazira',
    date: '2018-2019',
    issuer: 'EHESL Hazira',
  },
  {
    title: 'Safety Rally Award',
    year: '2014',
    achievement: 'Winner Trophy for participation in Safety Rally',
    recipient: 'M/s. Babu Enterprises',
    occasion: '43rd National Safety Day Celebration',
    date: '4th March 2014',
    issuer: 'Essar Steel',
  },
  {
    title: 'Contractor Safety Performance Award',
    year: '2012',
    achievement: 'Second Runners-up for Excellent Contractor Safety Performance',
    recipient: 'M/s. Babu Enterprises',
    occasion: '42nd National Safety Day Celebration',
    date: '4th March 2013',
    issuer: 'Essar Steel',
  },
  {
    title: 'Certificate of Excellence',
    year: '2012',
    achievement: 'Runner-up Trophy for Group Fire Fighting Competition',
    recipient: 'M/s. Babu Enterprise (CSP Mill)',
    occasion: '68th National Fire Service Day',
    date: '14th April 2012',
    issuer: 'Essar Steel India Limited, Hazira',
  },
  {
    title: 'Best Safety Rally Award',
    year: '2012',
    achievement: 'Second Prize for Best Safety Rally',
    recipient: 'M/s. Babu Engineering',
    occasion: '41st National Safety Day Celebration',
    date: '5th March 2012',
    issuer: 'Essar Steel',
  },
];

const defaultSafetyEvents = [
  {
    title: '48th National Safety Day Celebration',
    date: '28 March 2019',
    location: 'Essar Steel India Limited, Hazira',
    topics: ['PPE Usage & Compliance', 'Hazard Identification (HIRA)', 'Contractor Safety Best Practices'],
    participation: '300+ workers and supervisors',
    description: 'BEPL received the Second Prize for Contractors Safety Performance Award at the 1st Steel Safety Day & 48th National Safety Day celebration.',
    image: servicesCrane,
  },
  {
    title: '43rd National Safety Day Celebration',
    date: '4 March 2014',
    location: 'Essar Steel, Hazira',
    topics: ['Safety Rally & Parade', 'First Aid Demonstrations', 'Fire Safety Awareness'],
    participation: '200+ workers and staff',
    description: 'BEPL actively participated and won the Winner Trophy for the Safety Rally, reinforcing our culture of proactive safety engagement.',
    image: servicesPiping,
  },
  {
    title: '42nd National Safety Day Celebration',
    date: '5 March 2012',
    location: 'Essar Steel, Hazira',
    topics: ['Toolbox Talks', 'Emergency Response Drills', 'PPE Inspection'],
    participation: '150+ participants',
    description: 'BEPL earned the Second Prize for Best Safety Rally, demonstrating consistent commitment to workplace safety standards across all project sites.',
    image: aboutImage,
  },
];

const defaultStaffMeetings = [
  {
    icon: Target,
    purpose: 'Weekly Site Review',
    frequency: 'Weekly',
    description: 'Site managers and supervisors align on project progress, identify blockers, and coordinate resources to maintain schedule.',
    keyPoints: ['Progress tracking vs. plan', 'Safety observations review', 'Resource & manpower allocation'],
    participation: 'Site managers & supervisors',
  },
  {
    icon: Users,
    purpose: 'Monthly Planning Meeting',
    frequency: 'Monthly',
    description: 'Cross-functional planning session covering project milestones, client coordination, procurement status, and upcoming work fronts.',
    keyPoints: ['Project milestone review', 'Client feedback & coordination', 'Procurement & logistics planning'],
    participation: 'All department heads',
  },
  {
    icon: Shield,
    purpose: 'Pre-Shift Safety Briefing',
    frequency: 'Daily',
    description: 'Every shift begins with a structured toolbox talk ensuring all workers are briefed on daily hazards, PPE requirements, and emergency protocols.',
    keyPoints: ['Daily hazard identification', 'PPE compliance check', 'Emergency protocol review'],
    participation: 'All site workers — every shift',
  },
];

const defaultTrainingActivities = [
  {
    icon: HardHat,
    title: 'Toolbox Talks',
    frequency: 'Daily',
    description: 'Structured pre-shift safety briefings covering site-specific hazards, safe work procedures, and PPE requirements for each day\'s tasks.',
  },
  {
    icon: Shield,
    title: 'Safety Drills',
    frequency: 'Quarterly',
    description: 'Periodic emergency response drills including fire evacuation, first aid response, and confined space rescue scenarios.',
  },
  {
    icon: Award,
    title: 'Certifications & Training',
    frequency: 'Ongoing',
    description: 'Structured programs for rigging, scaffolding, welding safety, and equipment operation. Workers earn certifications upon completion.',
  },
];

export default function About() {
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [certIndex, setCertIndex] = useState(0);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      const response = await aboutAPI.get();
      setAboutData(response.data || {});
    } catch (error) {
      console.error('Failed to fetch about data:', error);
      setAboutData({});
    } finally {
      setLoading(false);
    }
  };

  const milestones = aboutData?.milestones || [];
  const values = aboutData?.values || [];
  const certifications = aboutData?.certifications || [];
  const teamStats = aboutData?.teamStats || { engineers: 103, supervisors: 209, technicians: 3000, yearsExperience: 44 };

  const hasAboutData = aboutData && Object.keys(aboutData).length > 0;

  const finalSafetyEvents = hasAboutData && aboutData.safetyEvents ? aboutData.safetyEvents : (loading ? [] : defaultSafetyEvents);
  const finalStaffMeetings = hasAboutData && aboutData.staffMeetings ? aboutData.staffMeetings : (loading ? [] : defaultStaffMeetings);
  const finalTrainingActivities = hasAboutData && aboutData.trainingActivities ? aboutData.trainingActivities : (loading ? [] : defaultTrainingActivities);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />
        <div className="container mx-auto px-4 relative">
          {loading ? (
            <HeroSkeleton />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Our Story
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {aboutData?.heroTitle || "Building a Legacy of"} <span className="text-gradient">{aboutData?.heroTitle ? "" : "Excellence"}</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                {aboutData?.heroDescription || "For over 44 years, BEPL has been at the forefront of industrial construction, delivering precision engineering and unwavering commitment to safety."}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* About Content */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          {loading ? (
            <ContentSkeleton />
          ) : (
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <ScrollReveal direction="left">
                <div className="relative">
                  <img
                    src={aboutData?.aboutImage || aboutImage}
                    alt="Industrial facility"
                    className="rounded-2xl shadow-2xl w-full aspect-[4/3] object-cover"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-card border border-border p-6 rounded-xl shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-display text-2xl font-bold">Zero</div>
                        <div className="text-sm text-muted-foreground">Accident Policy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                  Who We Are
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  {aboutData?.aboutContent ? (
                    <div dangerouslySetInnerHTML={{ __html: aboutData.aboutContent.replace(/\n/g, '<br />') }} />
                  ) : (
                    <>
                      <p>
                        The company M/s BABU ERECTORS PVT.LTD was formed in the year 2013, as a sister concern
                        of BABU ENGINEERING WORKS, established in 1982. We are the leading contractors in the area
                        of Fabrication and Erection of Structural works, Erection and Alignment of Mechanical Equipments,
                        and Fabrication and Erection of Piping works.
                      </p>
                      <p>
                        With the Head Office situated in Surat (Gujarat), Babu Erectors operates across India with
                        the highest ethical and professional standards. Our vision encompasses the tradition of
                        delivering quality by adopting best construction practices in the industry.
                      </p>
                      <p>
                        We specialize in mechanical and structural works, including fabrication and erection of 
                        Structural, Piping & Equipment for commercial and industrial clients. With over 44 years 
                        in the business, we've earned tremendous appreciation from our clients.
                      </p>
                    </>
                  )}
                </div>
              </ScrollReveal>
            </div>
          )}
        </div>
      </section>

      {/* Message from MD */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <MDMessageSkeleton />
            ) : (
              <ScrollReveal>
                <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-lg">
                  <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    <div>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                          <span className="font-display font-bold text-primary-foreground text-2xl">
                            {(aboutData?.mdMessage?.name || 'K. Samuel')
                              .split(/\s+/)
                              .map((w) => w[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2) || 'KS'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-display font-semibold text-xl">{aboutData?.mdMessage?.name || 'K. Samuel'}</h3>
                          <p className="text-muted-foreground">{aboutData?.mdMessage?.position || 'Managing Director'}</p>
                        </div>
                      </div>
                      <blockquote className="text-lg leading-relaxed text-muted-foreground italic border-l-4 border-primary pl-6">
                        {aboutData?.mdMessage?.message ? (
                          <div dangerouslySetInnerHTML={{ __html: aboutData.mdMessage.message.replace(/\n/g, '<br />') }} />
                        ) : (
                          <>
                            "It is my pleasure to communicate with you the 44 Years of business of BABU ERECTORS PVT LTD. 
                            Since founded in 1982, we have achieved new levels of growth through implementing a wide range 
                            of projects and positioned ourselves as one of the leading Engineering Companies in India.
                            <br /><br />
                            Being an engineering company, we have never compromised on the quality of safety work. We have
                            always ensured safety as a fundamental requirement for the continuation of our business operations.
                            Our 'Zero-accidental' policy has always set a benchmark for our goals.
                            <br /><br />
                            We consider the people at BEPL as one team and treat each other with equal respect. Together we
                            will achieve our goals."
                          </>
                        )}
                      </blockquote>
                    </div>
                    <div className="flex items-center justify-center">
                      <img 
                        src={aboutData?.mdMessage?.image || founderImage} 
                        alt={aboutData?.mdMessage?.name || 'K. Samuel'} 
                        className="rounded-2xl shadow-xl w-full max-w-md aspect-[3/4] object-cover"
                      />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal direction="left">
              <div className="bg-card border border-border rounded-2xl p-8 h-full">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Eye className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {aboutData?.vision || "To be the most trusted and preferred partner in industrial construction, recognized for our commitment to excellence, safety, and innovation. We aim to set industry benchmarks in structural steel erection and heavy engineering services across India."}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="bg-card border border-border rounded-2xl p-8 h-full">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {aboutData?.mission || "To deliver quality construction services with unwavering commitment to safety and on-time delivery. We strive to understand our clients' needs, provide technological solutions that add business value, and maintain the highest ethical and professional standards."}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Team Stats */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading
            badge="Our Team"
            title="Strength in Numbers"
            description="A dedicated workforce committed to excellence in every project."
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {[
              { value: teamStats.engineers || 50, suffix: '+', label: 'Engineers' },
              { value: teamStats.supervisors || 200, suffix: '+', label: 'Technical Supervisors' },
              { value: teamStats.technicians, suffix: '+', label: 'Skilled Technicians' },
              { value: teamStats.yearsExperience, suffix: '+', label: 'Years Experience' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-card border border-border rounded-2xl"
              >
                <div className="font-display text-4xl md:text-5xl font-bold text-primary mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Day Programs */}
      <section className="py-24 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4">
          <SectionHeading
            badge="Safety Programs"
            title="Safety Day Programs"
            description="Celebrating and reinforcing our zero-accident culture through structured safety events and awareness programs."
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={loading ? 'loading' : 'content'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16" staggerDelay={0.1}>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => <SafetyEventSkeleton key={i} />)
                ) : (
                  finalSafetyEvents.map((event: any) => (
                    <StaggerItem key={event.title}>
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="bg-card border border-border rounded-2xl overflow-hidden group h-full flex flex-col"
                      >
                        <div className="aspect-[16/9] overflow-hidden shrink-0">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3 self-start">
                            {event.date}
                          </span>
                          <h3 className="font-display font-semibold text-lg mb-2">{event.title}</h3>
                          <p className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                            <MapPin className="h-4 w-4 shrink-0" />
                            {event.location}
                          </p>
                          <p className="text-muted-foreground text-sm mb-4 leading-relaxed flex-1">{event.description}</p>
                          <div className="mb-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Topics Covered</p>
                            <ul className="space-y-1">
                              {event.topics.map((topic: string) => (
                                <li key={topic} className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                  {topic}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <p className="flex items-center gap-1.5 text-sm text-muted-foreground pt-3 border-t border-border">
                            <Users className="h-4 w-4 shrink-0" />
                            {event.participation}
                          </p>
                        </div>
                      </motion.div>
                    </StaggerItem>
                  ))
                )}
              </StaggerContainer>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Staff Meetings */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <SectionHeading
            badge="Our Team"
            title="Staff Meetings & Coordination"
            description="Regular structured meetings keep our teams aligned, projects on track, and safety standards upheld."
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={loading ? 'loading' : 'content'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <StaggerContainer className="grid sm:grid-cols-3 gap-6 mt-16" staggerDelay={0.1}>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => <MeetingCardSkeleton key={i} />)
                ) : (
                  finalStaffMeetings.map((meeting: any) => {
                    const Icon = typeof meeting.icon === 'string' ? iconMap[meeting.icon] || Target : meeting.icon;
                    return (
                      <StaggerItem key={meeting.purpose}>
                        <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all h-full flex flex-col">
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {meeting.frequency}
                          </span>
                        </div>
                        <h3 className="font-display font-semibold text-lg mb-2">{meeting.purpose}</h3>
                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed flex-1">{meeting.description}</p>
                        <ul className="space-y-1.5 mb-4">
                          {meeting.keyPoints.map((point: string) => (
                            <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              {point}
                            </li>
                          ))}
                        </ul>
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground pt-3 border-t border-border">
                          <Users className="h-3.5 w-3.5 shrink-0" />
                          {meeting.participation}
                        </p>
                      </div>
                    </StaggerItem>
                  )})
                )}
              </StaggerContainer>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Safety & Training Activities */}
      <section className="py-24 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4">
          <SectionHeading
            badge="Safety Culture"
            title="Safety & Training Activities"
            description="Structured programs that build a skilled, safety-conscious workforce on every site."
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={loading ? 'loading' : 'content'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <StaggerContainer className="grid sm:grid-cols-3 gap-6 mt-16" staggerDelay={0.1}>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => <TrainingCardSkeleton key={i} />)
                ) : (
                  finalTrainingActivities.map((activity: any) => {
                    const Icon = typeof activity.icon === 'string' ? iconMap[activity.icon] || Target : activity.icon;
                    return (
                      <StaggerItem key={activity.title}>
                        <div className="text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors h-full flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Icon className="h-8 w-8 text-primary" />
                          </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                          {activity.frequency}
                        </span>
                        <h3 className="font-display font-semibold text-lg mb-2">{activity.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{activity.description}</p>
                      </div>
                    </StaggerItem>
                  )})
                )}
              </StaggerContainer>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

    </Layout>
  );
}
