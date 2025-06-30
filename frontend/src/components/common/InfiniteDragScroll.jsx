import React from "react";
import { animate, cubicBezier, motion, useMotionValue, wrap, } from "motion/react";
import { memo, useContext, useEffect, useRef, useState, createContext } from "react";
import { cva } from "class-variance-authority";
import { assets } from '../../assets/assets';

const GridVariantContext = createContext();

const rowVariants = {
  initial: { opacity: 0, scale: 0.3 },
  animate: () => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: Math.random() + 1.5,
      duration: 1.4,
      ease: cubicBezier(0.18, 0.71, 0.11, 1),
    },
  }),
};

export const DraggableContainer = ({ className, children, variant }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const handleIsDragging = () => setIsDragging(true);
  const handleIsNotDragging = () => setIsDragging(false);

  useEffect(() => {
    const container = ref.current?.getBoundingClientRect();
    if (!container) return;
    const { width, height } = container;
    const xDrag = x.on("change", (latest) => {
      const wrappedX = wrap(-(width / 2), 0, latest);
      x.set(wrappedX);
    });
    const yDrag = y.on("change", (latest) => {
      const wrappedY = wrap(-(height / 2), 0, latest);
      y.set(wrappedY);
    });
    const handleWheelScroll = (event) => {
      if (!isDragging) {
        animate(y, y.get() - event.deltaY * 2.7, {
          type: "tween",
          duration: 1.2,
          ease: cubicBezier(0.18, 0.71, 0.11, 1),
        });
      }
    };
    window.addEventListener("wheel", handleWheelScroll);
    return () => {
      xDrag();
      yDrag();
      window.removeEventListener("wheel", handleWheelScroll);
    };
  }, [x, y, isDragging]);

  return (
    <GridVariantContext.Provider value={variant}>
      <div className="h-dvh overflow-hidden">
        <motion.div className="h-dvh overflow-hidden">
          <motion.div className={
            "grid h-fit w-fit cursor-grab grid-cols-[repeat(12,1fr)] bg-[#141414] active:cursor-grabbing will-change-transform " +
            (className || "")
          } drag dragMomentum={true} dragTransition={{
            timeConstant: 200,
            power: 0.28,
            restDelta: 0,
            bounceStiffness: 0,
          }} onMouseDown={handleIsDragging} onMouseUp={handleIsNotDragging} onMouseLeave={handleIsNotDragging} style={{ x, y }} ref={ref} >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </GridVariantContext.Provider>
  );
};

export const GridItem = ({ children, className }) => {
  const variant = useContext(GridVariantContext);
  const gridItemStyles = cva(
    "overflow-hidden hover:cursor-pointer w-full h-full will-change-transform",
    {
      variants: {
        variant: {
          default: "rounded-sm",
          masonry: "even:mt-[60%] rounded-sm ",
          polaroid:
            "border-10 border-b-28 border-white shadow-xl even:rotate-3 odd:-rotate-2 hover:rotate-0 transition-transform ease-out duration-300 even:mt-[60%]",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    }
  );
  return (
    <motion.div className={gridItemStyles({ variant, className })} variants={rowVariants} initial="initial" animate="animate" >
      {children}
    </motion.div>
  );
};

export const GridBody = memo(({ children, className }) => {
  const variant = useContext(GridVariantContext);
  const gridBodyStyles = cva("grid grid-cols-[repeat(6,1fr)] h-fit w-fit", {
    variants: {
      variant: {
        default: "gap-14 p-7 md:gap-28 md:p-14",
        masonry: "gap-x-14 px-7 md:gap-x-28 md:px-14",
        polaroid: "gap-x-14 px-7 md:gap-x-28 md:px-14",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className={gridBodyStyles({ variant, className })}>
          {children}
        </div>
      ))}
    </>
  );
});
GridBody.displayName = "GridBody";

const images = [
  { id: 1, alt: 'book1', src: assets.fbook1 },
  { id: 2, alt: 'book2', src: assets.fbook2 },
  { id: 3, alt: 'book3', src: assets.fbook3 },
  { id: 4, alt: 'book4', src: assets.fbook4 },
  { id: 5, alt: 'book5', src: assets.fbook5 },
  { id: 6, alt: 'book6', src: assets.fbook6 },
  { id: 7, alt: 'book7', src: assets.fbook7 },
  { id: 8, alt: 'book8', src: assets.fbook8 },
  { id: 9, alt: 'book9', src: assets.fbook9 },
  { id: 10, alt: 'book10', src: assets.fbook10 },
  { id: 11, alt: 'book11', src: assets.fbook11 },
  { id: 12, alt: 'book12', src: assets.fbook12 },
  { id: 13, alt: 'book13', src: assets.fbook13 },
  { id: 14, alt: 'book14', src: assets.fbook14 },
  { id: 15, alt: 'book15', src: assets.fbook15 },
  { id: 16, alt: 'book16', src: assets.fbook16 },
  { id: 17, alt: 'book17', src: assets.fbook17 },
  { id: 18, alt: 'book18', src: assets.fbook18 },
];

const InfiniteDragScroll = () => {
  const repeatedImages = Array(4).fill(images).flat().map((img, idx) => ({ ...img, id: `${img.id}-${idx}` }));
  return (
    <DraggableContainer variant="masonry">
      <GridBody>
        {repeatedImages.map((image) => (
          <GridItem key={image.id} className="relative h-54 w-36 md:h-96 md:w-64">
            <img
              src={image.src}
              alt={image.alt}
              className="pointer-events-none absolute h-full w-full object-cover"
            />
          </GridItem>
        ))}
      </GridBody>
    </DraggableContainer>
  );
};

export default InfiniteDragScroll; 