'use client';

import { motion } from 'framer-motion';

const titleLines = [
  { text: "Crea la IA que", className: "text-foreground" },
  { text: "Impulsa tu Negocio", className: "text-primary dark:text-accent" },
];

const sentence = {
  hidden: { opacity: 1 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: i * 0.5 },
  }),
};

const letter = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
  hidden: {
    opacity: 0,
    y: 20,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
};

export default function AnimatedTitle() {
  return (
    <h1 className="font-headline text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
      {titleLines.map((line, lineIndex) => (
        <motion.span
          className="block"
          key={lineIndex}
          variants={sentence}
          initial="hidden"
          animate="visible"
          custom={lineIndex + 1}
        >
          {line.text.split("").map((char, charIndex) => (
            <motion.span
              key={charIndex}
              variants={letter}
              className={`inline-block ${char === " " ? "w-2 sm:w-4" : ""} ${line.className}`}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      ))}
    </h1>
  );
}
