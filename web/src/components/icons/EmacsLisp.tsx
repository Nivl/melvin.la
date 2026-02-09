import { useId } from 'react';

export const EmacsLisp = ({ className }: { className: string }) => {
  const aId = useId();
  const bId = useId();
  const cId = useId();
  const dId = useId();
  const eId = useId();

  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      viewBox="0.171 0.201 512 512"
      height="48"
      width="48"
      version="1.0"
    >
      <defs>
        <linearGradient id={bId}>
          <stop offset="0" style={{ stopColor: '#411f5d', stopOpacity: 1 }} />
          <stop offset="1" style={{ stopColor: '#5b2a85', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id={aId}>
          <stop offset="0" style={{ stopColor: '#8381c5', stopOpacity: 1 }} />
          <stop
            style={{ stopColor: '#7e55b3', stopOpacity: 0.996_078_43 }}
            offset=".566"
          />
          <stop
            offset="1"
            style={{ stopColor: '#a52ecb', stopOpacity: 0.992_156_86 }}
          />
        </linearGradient>
        <linearGradient
          y2="300.74"
          x2="236.614"
          y1="-161.851"
          x1="-122.202"
          spreadMethod="pad"
          gradientTransform="matrix(.87386 0 0 .82818 246.008 250.281)"
          gradientUnits="userSpaceOnUse"
          id={dId}
          href={`#${aId}`}
        />
        <linearGradient
          y2="66.018"
          x2="173.945"
          y1="396.607"
          x1="447.809"
          gradientTransform="translate(3.034 2.525)scale(.98685)"
          gradientUnits="userSpaceOnUse"
          id={eId}
          href={`#${bId}`}
        />
        <filter
          height="1.088"
          y="-.044"
          width="1.089"
          x="-.045"
          id={cId}
          style={{ colorInterpolationFilters: 'sRGB' }}
        >
          <feGaussianBlur stdDeviation="8.785" />
        </filter>
      </defs>
      <path
        style={{
          opacity: 0.405_000_04,
          fill: '#211f46',
          fillOpacity: 0.996_078_43,
          stroke: '#0a0b1b',
          strokeWidth: 8.533_333_78,
          strokeMiterlimit: 4,
          strokeDasharray: 'none',
          strokeOpacity: 1,
          filter: `url(#${cId})`,
        }}
        d="M491.67 257.76c0 131.794-105.76 238.634-236.222 238.634S19.226 389.554 19.226 257.759 124.986 19.124 255.448 19.124s236.221 106.84 236.221 238.635z"
        transform="translate(3.034 2.525)scale(.98685)"
      />
      <path
        d="M488.238 256.895c0 130.06-104.37 235.496-233.115 235.496-128.746 0-233.115-105.435-233.115-235.496 0-130.062 104.37-235.497 233.115-235.497 128.746 0 233.115 105.435 233.115 235.497z"
        style={{
          opacity: 1,
          fill: `url(#${dId})`,
          fillOpacity: 1,
          stroke: `url(#${eId})`,
          strokeWidth: 13.338_168_14,
          strokeMiterlimit: 4,
          strokeDasharray: 'none',
          strokeOpacity: 1,
        }}
      />
      <path
        d="M175 422.31s19.739 1.397 45.132-.841c10.283-.906 49.326-4.741 78.516-11.143 0 0 35.59-7.617 54.63-14.633 19.923-7.342 30.764-13.573 35.644-22.403-.213-1.809 1.502-8.224-7.685-12.078-23.489-9.852-50.73-8.07-104.634-9.212-59.777-2.054-79.663-12.06-90.256-20.119-10.158-8.175-5.05-30.792 38.475-50.715 21.924-10.609 107.87-30.187 107.87-30.187-28.945-14.307-82.919-39.459-94.013-44.89-9.731-4.763-25.303-11.936-28.679-20.614-3.827-8.33 9.039-15.507 16.225-17.562 23.145-6.676 55.818-10.825 85.555-11.291 14.947-.234 17.373-1.196 17.373-1.196 20.625-3.421 34.202-17.532 28.545-39.879-5.078-22.81-31.862-36.214-57.314-31.573-23.968 4.37-81.738 21.15-81.738 21.15 71.408-.618 83.36.573 88.697 8.036 3.153 4.408-1.432 10.451-20.476 13.561-20.733 3.386-63.831 7.464-63.831 7.464-41.345 2.456-70.469 2.62-79.203 21.113-5.707 12.082 6.085 22.764 11.253 29.45 21.841 24.289 53.389 37.389 73.695 47.035 7.64 3.63 30.059 10.484 30.059 10.484-65.878-3.623-113.4 16.606-141.277 39.897-31.528 29.162-17.581 63.923 47.013 85.326 38.151 12.642 57.072 18.587 113.981 13.463 33.52-1.807 38.804-.732 39.139 2.019.47 3.872-37.232 13.491-47.524 16.46-26.186 7.553-94.828 22.805-95.172 22.879z"
        style={{
          fill: '#fff',
          fillOpacity: 1,
          fillRule: 'evenodd',
          stroke: '#000',
          strokeWidth: 0,
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 4,
          strokeDasharray: 'none',
          strokeOpacity: 1,
        }}
      />
    </svg>
  );
};
