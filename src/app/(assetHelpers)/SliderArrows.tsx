
type ArrowProps = {
    className?: string;
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
};

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

