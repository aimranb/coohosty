/** Shared geometry for the wordmark and the service signature. */
export function EyeArtwork() {
  return <>
    {[50,114].map((center,index) => <g className={`signature-eye signature-eye-${index}`} key={center}>
      <ellipse cx={center} cy="43" rx="26" ry="32" fill="#fffefa" stroke="currentColor" strokeWidth="2.5"/>
      <g className="signature-pupil"><circle cx={center} cy="44" r="11" fill="currentColor"/><circle cx={center + 3} cy="40" r="3" fill="white"/><circle cx={center - 3} cy="48" r="1.5" fill="#c9a96e"/></g>
    </g>)}
    <path className="signature-smile" d="M68 79Q82 94 96 79" stroke="#c9a96e" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M23 60q5 3 10 0m98 0q5 3 10 0" stroke="#c9a96e" strokeWidth="1.5" opacity=".5" strokeLinecap="round"/>
  </>;
}
