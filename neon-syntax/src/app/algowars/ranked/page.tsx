
'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Monaco Editor
const RankedMatchView = dynamic(
    () => import('../../../components/algowars/RankedMatchView'),
    { ssr: false }
);

export default function RankedPage() {
    return <RankedMatchView />;
}
