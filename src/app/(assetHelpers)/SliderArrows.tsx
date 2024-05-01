
/**
 * NextArrow is a functional component that renders a custom right arrow for a carousel.
 * It can be customized with CSS classes and styles. The arrow includes conditional styling
 * to indicate if it is inactive (not clickable).
 *
 * @component
 * @example
 * return <NextArrow className="custom-class" style={{ margin: "10px" }} onClick={handleClick} />
 *
 * @param {Object} props - Props for the NextArrow component.
 * @param {string} props.className - CSS class for custom styling.
 * @param {React.CSSProperties} props.style - Inline styles for the arrow.
 * @param {() => void} props.onClick - Function to call when the arrow is clicked.
 */
export const NextArrow: React.FC<ArrowProps> = ({ className, style, onClick }) => {
  return (
    <div
      className={className}
      style={{color: 'lightgrey'}}
      onClick={onClick}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" 
          style={{
            opacity: onClick === null ? 0.3 : 1
          }}/>
        </svg>
    </div>
  )
};

/**
 * PrevArrow is a functional component that renders a custom right arrow for a carousel.
 * It can be customized with CSS classes and styles. The arrow includes conditional styling
 * to indicate if it is inactive (not clickable).
 *
 * @component
 * @example
 * return <PrevArrow className="custom-class" style={{ margin: "10px" }} onClick={handleClick} />
 *
 * @param {Object} props - Props for the PrevArrow component.
 * @param {string} props.className - CSS class for custom styling.
 * @param {React.CSSProperties} props.style - Inline styles for the arrow.
 * @param {() => void} props.onClick - Function to call when the arrow is clicked.
 */
export  const PrevArrow: React.FC<ArrowProps> = ({ className, style, onClick }) => {
  return (
    <div
      className={className}
      style={{color: 'lightgrey'}}
      onClick={onClick}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" 
          style={{
            opacity: onClick === null ? 0.3 : 1
            }}/>
        </svg>
    </div>
  )
};


type ArrowProps = {
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};
