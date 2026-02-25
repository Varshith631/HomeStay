import { motion } from 'framer-motion';

const pageVariants = {
    initial: { opacity: 0, scale: 0.98, filter: "blur(10px)" },
    in: { opacity: 1, scale: 1, filter: "blur(0px)" },
    out: { opacity: 0, scale: 1.02, filter: "blur(10px)" }
};

export default function PageTransition({ children }) {
    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ type: 'tween', ease: 'anticipate', duration: 0.5 }}
            style={{ padding: '100px 20px 40px', flex: 1 }}
        >
            {children}
        </motion.div>
    );
}
