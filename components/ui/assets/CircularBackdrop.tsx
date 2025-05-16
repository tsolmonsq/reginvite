"use client";

import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

export default function CircularBackdrop() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-10 bg-white/50 backdrop-blur-sm flex justify-center items-center justify-center z-50"
    >
      <CircularProgress size={60} thickness={5} />
    </motion.div>
  );
}
