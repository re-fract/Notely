import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
}

const TypewriterText = ({ text, speed = 100, className = '' }: TypewriterTextProps) => {
  const [displayed, setDisplayed] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (displayed.length < text.length) {
      setIsTyping(true);
      const timeout = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    }
    setIsTyping(false);
  }, [displayed, text, speed]);

  // Blink cursor only after typing is done
  useEffect(() => {
    if (isTyping) return;
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, [isTyping]);

  return (
    <span className={`inline ${className}`}>
      {displayed}
      <span
        className="inline"
        style={{
          opacity: showCursor ? 1 : 0,
          transition: 'opacity 0.1s ease',
        }}
      >
        |
      </span>
    </span>
  );
};

export default TypewriterText;
