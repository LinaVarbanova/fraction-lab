import { motion, useReducedMotion } from 'motion/react';
/** Original vector academy, with geometric mathematical mechanisms. */
export default function AcademyArt() {
  const reduced = useReducedMotion();
  return <svg className="academy-art" viewBox="0 0 660 460" role="img" aria-labelledby="academy-art-title"><title id="academy-art-title">Геометрична академия: мостове, стълби и кула от дроби</title>
    <defs><linearGradient id="island" x2="0.8" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#e4edf8"/></linearGradient><linearGradient id="tower" x2="1" y2="1"><stop stopColor="#a6c4ff"/><stop offset="1" stopColor="#608ee8"/></linearGradient><linearGradient id="teal" x2="1" y2="1"><stop stopColor="#78ddc9"/><stop offset="1" stopColor="#25ae9b"/></linearGradient><filter id="shadow"><feGaussianBlur stdDeviation="16"/></filter><pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#ccd9e9"/></pattern></defs>
    <rect x="40" y="22" width="580" height="390" fill="url(#dots)" opacity=".5"/>
    <ellipse cx="339" cy="384" rx="220" ry="29" fill="#a7bddb" opacity=".22" filter="url(#shadow)"/>
    <path d="M93 303 315 175 570 321 347 450Z" fill="#d3dfef"/><path d="M93 281 315 153 570 299 347 428Z" fill="url(#island)"/><path d="M93 281v22l254 147v-22Z" fill="#e1e9f4"/><path d="m347 428 223-129v22L347 450Z" fill="#bdcfe8"/>
    <path d="m127 282 181-104 221 127-181 105Z" fill="#f9fbff" stroke="#e6edf7"/>
    <path d="m190 303 117-68 130 75" stroke="#d4e4fc" strokeWidth="22" fill="none"/>
    <path d="m190 303 117-68 130 75" stroke="#fff" strokeWidth="2" strokeDasharray="4 8" fill="none"/>
    <g><path d="m270 150 68-39 68 39v156l-68 39-68-39Z" fill="#c6dafb"/><path d="m338 189 68-39v156l-68 39Z" fill="#7da3e4"/><path d="m270 150 68-39 68 39-68 39Z" fill="#edf4ff"/>
    <path d="m281 131 57-33 57 33v30l-57 33-57-33Z" fill="#9bbdf6"/><path d="m338 164 57-33v30l-57 33Z" fill="#5f8ddd"/><path d="m281 131 57-33 57 33-57 33Z" fill="#e1eeff"/>
    <path d="m298 102 40-23 40 23v28l-40 23-40-23Z" fill="url(#tower)"/><path d="m298 102 40-23 40 23-40 23Z" fill="#dbe9ff"/>
    <path d="M338 80V48" stroke="#91b0df" strokeWidth="3"/><path d="m340 48 33 10-33 12Z" fill="#ffb84d"/>
    <path d="M296 251v-34c0-20 26-21 26-1v50Z" fill="#fff" opacity=".9"/><path d="M355 250v-34c0-20 26-35 26-15v35Z" fill="#e5efff"/>
    <path d="M301 253v-27m-9 9 30 17" stroke="#b0c9ef" strokeWidth="2"/>
    <path d="m332 303 37-22v38l-37 22Z" fill="#416bb0"/>
    <path d="m339 306 20-12v22l-20 12Z" fill="#fff" opacity=".85"/>
    <path d="m280 176 42 24m-42 30 42 24m-42 30 42 24" stroke="#ebf3ff" strokeWidth="2"/></g>
    <g><path d="m146 260 51-30 51 30v52l-51 30-51-30Z" fill="#9ddfce"/><path d="m197 289 51-29v52l-51 30Z" fill="#4bb6a1"/><path d="m146 260 51-30 51 30-51 29Z" fill="#d3f4e9"/><path d="m158 250 39-23 39 23-39 23Z" fill="url(#teal)"/>
    <path d="m169 256 39-23m-26 30 39-23m-39-20 39 23m-52-15 39 23" stroke="#fff" strokeWidth="2"/>
    <path d="m166 285 16 9v20l-16-9Z" fill="#e7fff7"/></g>
    <g><path d="m418 274 48-28 48 28v55l-48 28-48-28Z" fill="#d8cafa"/><path d="m466 302 48-28v55l-48 28Z" fill="#a68bdc"/><path d="m418 274 48-28 48 28-48 28Z" fill="#eee7ff"/><ellipse cx="466" cy="267" rx="35" ry="20" fill="#b99aee"/><path d="M466 267v-20a35 20 0 0 1 30 30Z" fill="#8b5cf6"/><path d="m466 267-30 10m30-10 30 10m-30-10v-20" stroke="#fff" strokeWidth="2"/></g>
    <g fill="#fff" stroke="#e1e9f4"><path d="m245 337 56-32 23 13-56 32Z"/><path d="m245 337v10l23 13v-10Z"/><path d="m268 350 56-32v10l-56 32Z"/><path d="m256 354 56-32 23 13-56 32Z"/><path d="m256 354v10l23 13v-10Z"/><path d="m279 367 56-32v10l-56 32Z"/><path d="m267 371 56-32 23 13-56 32Z"/><path d="m267 371v10l23 13v-10Z"/><path d="m290 384 56-32v10l-56 32Z"/></g>
    <motion.g initial={false} animate={reduced ? {} : { y: [0, -5, 0] }} transition={{ duration: 4, repeat: 2, ease: 'easeInOut' }}><path d="m446 148 25-14 25 14v28l-25 15-25-15Z" fill="#ffcc78"/><path d="m446 148 25-14 25 14-25 15Z" fill="#ffe5b6"/><path d="m471 163 25-15v28l-25 15Z" fill="#f5af45"/></motion.g>
    <g fill="#adc6e9"><circle cx="174" cy="164" r="4"/><circle cx="534" cy="231" r="3"/><path d="M230 111v12m-6-6h12" stroke="#abc2e5" strokeWidth="2"/></g><path d="m113 221 14-8 14 8-14 8Z" fill="#b3dfd5"/>
  </svg>;
}
