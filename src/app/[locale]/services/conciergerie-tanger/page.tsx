import { CityCohostingPage, cityMetadata, type CityPageProps } from '@/components/sections/city-cohosting-page';

export function generateMetadata({ params }: CityPageProps) { return cityMetadata('tanger', params); }
export default function Page(props: CityPageProps) { return <CityCohostingPage {...props} market="tanger"/>; }
