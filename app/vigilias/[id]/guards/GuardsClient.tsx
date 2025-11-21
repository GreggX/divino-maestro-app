'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

interface Member {
  id: string;
  nombre: string;
}

interface TimeSlot {
  id: string;
  horaInicio: string;
  horaFin: string;
  primerCoro: string[];
  segundoCoro: string[];
}

interface TimeBlock {
  id: string;
  bloqueHora: string;
  turnos: TimeSlot[];
}

interface GuardsClientProps {
  vigilId: string;
  initialMembers: Member[];
  initialTimeBlocks: TimeBlock[];
}

export function GuardsClient({
  vigilId,
  initialMembers,
  initialTimeBlocks,
}: GuardsClientProps) {
  const t = useTranslations('vigilia.guardAssignment');
  const tCommon = useTranslations('common');

  const [availableMembers, setAvailableMembers] =
    useState<Member[]>(initialMembers);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(initialTimeBlocks);
  const [portaHachas, setPortaHachas] = useState<string[]>([]);
  const [ayudaronMisa, setAyudaronMisa] = useState<string[]>([]);
  const [activeMember, setActiveMember] = useState<Member | null>(null);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<TimeBlock | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const member = availableMembers.find((m) => m.id === event.active.id);
    if (member) {
      setActiveMember(member);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveMember(null);

    if (!over) return;

    const memberId = active.id as string;
    const overId = over.id as string;

    // Handle drop to porta hachas
    if (overId === 'portaHachas') {
      setPortaHachas((prev) => [...prev, memberId]);
      setAvailableMembers((prev) => prev.filter((m) => m.id !== memberId));
      return;
    }

    // Handle drop to ayudaron misa
    if (overId === 'ayudaronMisa') {
      setAyudaronMisa((prev) => [...prev, memberId]);
      setAvailableMembers((prev) => prev.filter((m) => m.id !== memberId));
      return;
    }

    // Handle drop to time slots
    const [blockId, slotId, choir] = overId.split('-');
    if (blockId && slotId && choir) {
      setTimeBlocks((prev) =>
        prev.map((block) =>
          block.id === blockId
            ? {
                ...block,
                turnos: block.turnos.map((slot) =>
                  slot.id === slotId
                    ? {
                        ...slot,
                        [choir]: [...slot[choir as keyof typeof slot], memberId],
                      }
                    : slot
                ),
              }
            : block
        )
      );
      setAvailableMembers((prev) => prev.filter((m) => m.id !== memberId));
    }
  };

  const handleSplitBlock = (block: TimeBlock) => {
    setSelectedBlock(block);
    setIsSplitModalOpen(true);
  };

  const getMemberName = (memberId: string): string => {
    const member = initialMembers.find((m) => m.id === memberId);
    return member?.nombre || memberId;
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="mt-1 text-gray-400">{t('dragInstruction')}</p>
        </div>
      </header>

      {/* Main Content - Split View */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Panel - Available Members */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">
              {t('availableMembers')}
            </h2>
            <div className="space-y-2 rounded-lg border border-gray-800 bg-gray-800/50 p-4">
              {availableMembers.length === 0 ? (
                <p className="text-center text-gray-400">
                  {tCommon('loading')}
                </p>
              ) : (
                availableMembers.map((member) => (
                  <div
                    key={member.id}
                    id={member.id}
                    draggable
                    className="cursor-move rounded-lg bg-gray-700 p-3 font-medium transition-colors hover:bg-gray-600"
                  >
                    {member.nombre}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Panel - Timeline */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">{t('timeline')}</h2>
            <div className="space-y-4">
              {timeBlocks.length === 0 ? (
                <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-8 text-center">
                  <p className="text-gray-400">{tCommon('loading')}</p>
                </div>
              ) : (
                timeBlocks.map((block) => (
                  <div
                    key={block.id}
                    className="rounded-lg border border-gray-800 bg-gray-800/50 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        {block.bloqueHora}
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSplitBlock(block)}
                      >
                        {t('splitBlock')}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {block.turnos.map((slot) => (
                        <div
                          key={slot.id}
                          className="rounded-lg bg-gray-700/50 p-3"
                        >
                          <p className="mb-2 text-sm text-gray-400">
                            {slot.horaInicio} - {slot.horaFin}
                          </p>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {/* First Choir */}
                            <div>
                              <p className="mb-1 text-xs font-medium text-gray-400">
                                {t('firstChoir')}
                              </p>
                              <div
                                id={`${block.id}-${slot.id}-primerCoro`}
                                className="min-h-[60px] rounded border-2 border-dashed border-gray-600 bg-gray-800/50 p-2"
                              >
                                {slot.primerCoro.map((memberId) => (
                                  <div
                                    key={memberId}
                                    className="mb-1 rounded bg-amber-900/30 px-2 py-1 text-xs text-amber-400"
                                  >
                                    {getMemberName(memberId)}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Second Choir */}
                            <div>
                              <p className="mb-1 text-xs font-medium text-gray-400">
                                {t('secondChoir')}
                              </p>
                              <div
                                id={`${block.id}-${slot.id}-segundoCoro`}
                                className="min-h-[60px] rounded border-2 border-dashed border-gray-600 bg-gray-800/50 p-2"
                              >
                                {slot.segundoCoro.map((memberId) => (
                                  <div
                                    key={memberId}
                                    className="mb-1 rounded bg-blue-900/30 px-2 py-1 text-xs text-blue-400"
                                  >
                                    {getMemberName(memberId)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Special Roles Section */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">{t('specialRoles')}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Porta Hachas */}
            <div>
              <p className="mb-2 font-medium">
                {useTranslations('vigilia')('torchBearers')}
              </p>
              <div
                id="portaHachas"
                className="min-h-[100px] rounded-lg border-2 border-dashed border-gray-700 bg-gray-800/50 p-4"
              >
                {portaHachas.map((memberId) => (
                  <div
                    key={memberId}
                    className="mb-2 rounded bg-purple-900/30 px-3 py-2 text-purple-400"
                  >
                    {getMemberName(memberId)}
                  </div>
                ))}
              </div>
            </div>

            {/* Ayudaron Misa */}
            <div>
              <p className="mb-2 font-medium">
                {useTranslations('vigilia')('massHelpers')}
              </p>
              <div
                id="ayudaronMisa"
                className="min-h-[100px] rounded-lg border-2 border-dashed border-gray-700 bg-gray-800/50 p-4"
              >
                {ayudaronMisa.map((memberId) => (
                  <div
                    key={memberId}
                    className="mb-2 rounded bg-green-900/30 px-3 py-2 text-green-400"
                  >
                    {getMemberName(memberId)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeMember ? (
          <div className="cursor-grabbing rounded-lg bg-amber-600 p-3 font-medium text-white shadow-lg">
            {activeMember.nombre}
          </div>
        ) : null}
      </DragOverlay>

      {/* Split Block Modal */}
      <Modal
        isOpen={isSplitModalOpen}
        onClose={() => setIsSplitModalOpen(false)}
        title={t('splitBlock')}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-400">
            {/* TODO: Implement split block functionality */}
            Split block functionality coming soon
          </p>
          <Button onClick={() => setIsSplitModalOpen(false)} fullWidth>
            {tCommon('close')}
          </Button>
        </div>
      </Modal>
    </DndContext>
  );
}
