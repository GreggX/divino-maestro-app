import { getTranslations } from 'next-intl/server';
import { GuardsClient } from './GuardsClient';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function GuardsPage({ params }: PageProps) {
  const t = await getTranslations('vigilia.guardAssignment');

  // TODO: Fetch vigil and available members from database
  const vigilId = params.id;
  const availableMembers = [];
  const timeBlocks = [];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <GuardsClient
        vigilId={vigilId}
        initialMembers={availableMembers}
        initialTimeBlocks={timeBlocks}
      />
    </div>
  );
}
