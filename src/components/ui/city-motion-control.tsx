'use client';
import { useState } from 'react';
import { Pause, Play } from 'lucide-react';

export function CityMotionControl({ pause, play }: { pause: string; play: string }) {
  const [paused, setPaused] = useState(false);
  return <button className="city-motion-control" type="button" aria-pressed={paused} onClick={event => { event.currentTarget.closest('section')?.setAttribute('data-motion-paused', String(!paused)); setPaused(!paused); }}>{paused ? <Play size={13}/> : <Pause size={13}/>}<span>{paused ? play : pause}</span></button>;
}
