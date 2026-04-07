import { useReducedMotion, motion } from 'framer-motion';

export const springTransition = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
  mass: 1,
};

export const STANDARD_EASE = [0.4, 0, 0.2, 1];

// 包装动画高阶组件，自动处理 Reduced Motion
export const StaggeredSection = ({ children, ...props }: any) => {
  const prefersReducedMotion = useReducedMotion();
  
  const variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: STANDARD_EASE, staggerChildren: 0.1 }
    }
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      variants={variants}
      {...props}
    >
      {children}
    </motion.section>
  );
};
