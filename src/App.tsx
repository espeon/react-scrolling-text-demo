import React, { CSSProperties, useEffect, useRef, useState } from 'react';

interface ScrollingTextProps {
  text: string;
  className?: string;
}

export default function Component() {
  return (
    <div className="p-4 space-y-4 ">
      <h1 className="text-2xl font-bold">Scrolling Text Demo</h1>
      <ScrollingText
        text="So Much for Stardust"
        className="bg-gray-200 p-2 rounded"
      />
      <ScrollingText
        text="Tell That Mick He Just Made My List of Things to Do Today - Fall Out Boy"
        className="bg-gray-200 p-2 rounded max-w-xl"
      />
      <div className="w-1/2 mx-auto">
        <ScrollingText
          text="This is a short text that doesn't need scrolling"
          className="bg-gray-200 p-2 rounded"
        />
      </div>
      <div className="w-3/4 mx-auto">
        <ScrollingText
          text="This is a very long text that will need to scroll because it doesn't fit within the container width and demonstrates the Spotify-like scrolling animation with fade-out effects on both sides, now scrolling all the way through before reversing"
          className="bg-gray-200 p-2 rounded"
        />
      </div>
      <div className="w-full">
        <ScrollingText
          text="This text is in a full-width container to demonstrate the component's ability to adapt to different parent widths"
          className="bg-gray-200 p-2 rounded"
        />
      </div>
    </div>
  );
}

function ScrollingText({ text, className = '' }: ScrollingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const dupeTextRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(0);
  const [textWidth, setTextWidth] = useState(0);

  const calculateOverflow = () => {
    const container = containerRef.current;
    const textElement = textRef.current;
    const dupe = dupeTextRef.current;

    if (container && textElement) {
      let isTextOverflowing;
      let len;

      if (dupe !== null) {
        isTextOverflowing = textElement.scrollWidth / 2 > container.offsetWidth;
        len = textElement.scrollWidth / 2;
      } else {
        isTextOverflowing = textElement.scrollWidth > container.offsetWidth;
        len = textElement.scrollWidth;
      }

      setIsOverflowing(isTextOverflowing);

      if (isTextOverflowing) {
        const duration = len / 30; // Adjust speed here
        setAnimationDuration(duration);
        setTextWidth(len);
      }
    }
  };

  useEffect(() => {
    calculateOverflow();
  }, [text]);

  useEffect(() => {
    window.addEventListener('resize', calculateOverflow);
    return () => window.removeEventListener('resize', calculateOverflow);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
    >
      <div
        className={`${
          isOverflowing ? 'opacity-100' : 'opacity-0'
        } absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-gray-200 to-transparent z-10 transition-all duration-500`}
      />
      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-gray-200 to-transparent z-10" />
      <div
        ref={textRef}
        className={`whitespace-nowrap ${
          isOverflowing ? 'animate-scroll-text' : ''
        }`}
        style={
          {
            animationDuration: isOverflowing ? `${animationDuration}s` : '0s',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            // the 0.5rem here is based off half the padding in the span below
            // (padding of value 4 is 1rem)
            '--text-width': `calc(${textWidth}px + 0.5rem)`,
          } as CSSProperties
        }
      >
        <span className="pr-4">{text}</span>
        {isOverflowing && <span ref={dupeTextRef}>{text}</span>}
      </div>
    </div>
  );
}
