import { getTranslations } from 'next-intl/server';
import { AttendanceClient } from './AttendanceClient';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function AttendancePage({ params }: PageProps) {
  const t = await getTranslations('vigilia.attendance');

  // TODO: Fetch vigil and members from database
  const vigilId = params.id;
  const members = [];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AttendanceClient vigilId={vigilId} initialMembers={members} />
    </div>
  );
}
