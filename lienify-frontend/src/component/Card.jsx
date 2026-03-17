
import React from "react";
import { motion } from "framer-motion";

const Card = ({ title, desc, barColor }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="lf-card"
    >
      <div
        className="lf-card-bar"
        style={{ background: barColor || "linear-gradient(90deg, #1dd9b0, #c42db8)" }}
      />
      <h3>{title}</h3>
      <p>{desc}</p>
    </motion.div>
  );
};

export default Card;

