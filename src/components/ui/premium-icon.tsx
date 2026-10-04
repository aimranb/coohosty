import artwork from '@/config/phosphor-workflow.json';

export type PremiumIconName = keyof typeof artwork.icons;

/** Local Phosphor duotone assets: server-renderable, with no icon-font request. */
export function PremiumIcon({ name }: { name: PremiumIconName }) {
  const icon = artwork.icons[name];
  return <svg className="premium-workflow-icon" width="60" height="60" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false">
    <path className="premium-icon-tone" d={icon.background}/>
    <path d={icon.foreground}/>
  </svg>;
}
