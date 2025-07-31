import { cn } from '@/lib/utils';
import { WSliderProps } from './types';

export default function WSlider({
  children,
  className = '',
  autoplay = false,
  interval = 5000,
  infinite = true,
  dots = true,
  arrows = true,
  slidesToShow = 1,
  slidesToScroll = 1,
  responsive = [],
  id,
  'data-w-id': dataWId,
  ...props
}: WSliderProps) {
  const sliderClasses = cn(
    'w-slider',
    'relative overflow-hidden',
    className
  );

  return (
    <div
      className={sliderClasses}
      id={id}
      data-w-id={dataWId}
      {...props}
    >
      <div className="flex transition-transform duration-300 ease-in-out">
        {children}
      </div>
      
      {dots && (
        <div className="flex justify-center mt-4 space-x-2">
          {/* Dots would be rendered here */}
        </div>
      )}
      
      {arrows && (
        <>
          <button className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md">
            ←
          </button>
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md">
            →
          </button>
        </>
      )}
    </div>
  );
}