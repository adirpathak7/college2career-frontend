import React, { useEffect, useState, useRef } from 'react'
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate
} from 'framer-motion'

import {
  FaUserCheck,
  FaBuilding,
  FaClipboardCheck,
  FaGraduationCap,
  FaBriefcase,
  FaChartLine
} from 'react-icons/fa'

import { Link } from 'react-router-dom'
import PageTitle from '../PageTitle'
import Footer from './Footer'
import Navbar from './Navbar'

/* ================= COUNTER CARD ================= */
const CounterCard = ({ icon, value, suffix, label, delay }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const count = useMotionValue(0)
  const rounded = useTransform(count, Math.round)

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: 2.2,
        ease: "easeOut"
      })

      return controls.stop
    }
  }, [isInView, value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -12, scale: 1.05 }}
      className="relative group bg-white/70 backdrop-blur-xl p-14 rounded-3xl
      border border-blue-100 shadow-xl
      hover:shadow-[0_25px_50px_rgba(0,90,205,0.3)]
      transition-all duration-300 overflow-hidden"
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4dd3ff]/20 to-[#005acd]/20 
      opacity-0 group-hover:opacity-100 transition" />

      {/* Icon */}
      <div className="relative z-10 mx-auto mb-6 w-20 h-20 flex items-center justify-center
        rounded-full bg-gradient-to-br from-[#005acd] to-[#4dd3ff]
        text-white text-4xl shadow-lg group-hover:scale-110 transition">
        {icon}
      </div>

      {/* Counter */}
      <h3 className="relative z-10 text-4xl font-extrabold text-[#003f88]">
        <motion.span>{rounded}</motion.span>{suffix}
      </h3>

      <p className="relative z-10 text-gray-600 mt-3 tracking-wide uppercase text-sm">
        {label}
      </p>
    </motion.div>
  )
}

/* ================= HOME ================= */
export default function Home() {
  const heroImages = [
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80"
  ]

  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % heroImages.length)
    }, 3500)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <PageTitle title="Home" />
      <Navbar />

      <div className="bg-[#f4fbff] w-full font-sans overflow-hidden">

        {/* ================= HERO SECTION ================= */}
        <section className="relative px-8 md:px-20 py-28 bg-gradient-to-br from-[#003f88] via-[#005acd] to-[#4dd3ff] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),transparent_60%)]"></div>

          <div className="relative grid md:grid-cols-2 gap-14 items-center">

            {/* LEFT CONTENT */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                From <span className="text-[#bef0ff]">College</span> to <br />
                <span className="text-[#bef0ff]">Career</span> — Made Simple
              </h1>

              <p className="mt-6 text-lg text-blue-100 max-w-xl">
                College2Career is an end-to-end campus placement platform
                helping students, colleges and recruiters connect seamlessly.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/login"
                  className="bg-white text-[#005acd] px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-[#bef0ff] transition"
                >
                  Get Started
                </Link>

                <Link
                  to="/register"
                  className="border border-white px-8 py-3 rounded-full hover:bg-white hover:text-[#005acd] transition"
                >
                  Join Now
                </Link>
              </div>
            </motion.div>

            {/* RIGHT IMAGE SLIDER */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative w-full max-w-xl mx-auto h-[420px] rounded-3xl overflow-hidden shadow-2xl"
            >
              {heroImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="career"
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] 
                  ${index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                />
              ))}

              <div className="absolute inset-0 bg-black/25"></div>

              {/* DOTS */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                {heroImages.map((_, i) => (
                  <span
                    key={i}
                    className={`w-3 h-3 rounded-full ${i === current ? 'bg-white' : 'bg-white/40'
                      }`}
                  ></span>
                ))}
              </div>
            </motion.div>

          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="relative bg-gradient-to-b from-[#dff2ff] via-[#eef9ff] to-[#f9fcff] py-28 px-6 md:px-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-14 text-center max-w-7xl mx-auto">

            <CounterCard
              icon={<FaGraduationCap />}
              value={5000}
              suffix="+"
              label="Students Placed"
              delay={0}
            />

            <CounterCard
              icon={<FaBuilding />}
              value={300}
              suffix="+"
              label="Partner Companies"
              delay={0.2}
            />

            <CounterCard
              icon={<FaChartLine />}
              value={92}
              suffix="%"
              label="Success Rate"
              delay={0.4}
            />

          </div>
        </section>


        {/* ================= FEATURES ================= */}
        <section className="py-28 px-6 md:px-20 bg-gradient-to-b from-[#eef9ff] to-[#f0f9ff] text-center">
          <h2 className="text-4xl font-bold text-[#003f88] mb-20">
            Why Choose College2Career?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
            {[
              {
                title: "Verified Students",
                desc: "Only college-approved students can apply.",
                icon: <FaUserCheck />
              },
              {
                title: "Trusted Companies",
                desc: "Companies are verified before posting jobs.",
                icon: <FaBriefcase />
              },
              {
                title: "Complete Tracking",
                desc: "Track applications, interviews & offers.",
                icon: <FaClipboardCheck />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -12 }}
                className="group relative bg-white p-12 rounded-3xl shadow-xl
                   border border-blue-100
                   hover:shadow-[0_25px_50px_rgba(0,90,205,0.25)]
                   transition-all duration-300"
              >
                {/* Accent bar */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#005acd] to-[#4dd3ff] rounded-t-3xl"></div>

                <div className="text-5xl text-[#005acd] mb-6 transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </div>

                <h3 className="text-xl font-semibold text-[#003f88] mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="py-28 px-6 md:px-20 bg-gradient-to-b from-[#e3f4ff] to-[#f9fcff] text-center">
          <h2 className="text-4xl font-bold text-[#003f88] mb-20">
            How College2Career Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
            {[
              { step: "01", title: "Student Registration", desc: "Register & get verified by your college." },
              { step: "02", title: "Company Hiring", desc: "Approved companies post jobs & internships." },
              { step: "03", title: "Placement Success", desc: "Apply, attend interviews & get placed." }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.07, y: -8 }}
                className="group relative bg-white p-12 rounded-3xl shadow-xl
                   border border-blue-100
                   hover:shadow-[0_30px_60px_rgba(0,90,205,0.3)]
                   transition-all duration-300"
              >
                {/* Step bubble */}
                <span className="absolute -top-8 left-6 w-16 h-16 flex items-center justify-center
                         rounded-full bg-gradient-to-br from-[#005acd] to-[#4dd3ff]
                         text-white text-2xl font-extrabold shadow-lg">
                  {item.step}
                </span>

                <h3 className="text-xl font-semibold text-[#003f88] mt-10 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="bg-gradient-to-r from-[#003f88] to-[#005acd] text-white py-24 text-center px-6">
          <h2 className="text-4xl font-bold mb-4">
            Your Career Starts From Here
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-10 text-lg">
            A complete placement management system designed for students,
            colleges and recruiters.
          </p>

          <Link
            to="/register"
            className="inline-block bg-white text-[#005acd] px-10 py-4 rounded-full font-semibold shadow-xl hover:bg-[#bef0ff] transition"
          >
            Create Free Account
          </Link>
        </section>

      </div>

      <Footer />
    </>
  )
}
