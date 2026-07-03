import { AnimatePresence } from 'motion/react';
import type { Show } from '../../data/shows';
import { ShowCard } from './ShowCard';

interface ShowGridProps {
  shows: Show[];
}

export function ShowGrid({ shows }: ShowGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
      <AnimatePresence mode="popLayout">
        {shows.map((show, index) => (
          <ShowCard key={show.id} show={show} index={index} />
        ))}
      </AnimatePresence>
    </div>
  );
}