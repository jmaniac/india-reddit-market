import { SortSelect } from './filters/SortSelect';
import { PriceRange } from './filters/PriceRange';
import { DateFilter } from './filters/DateFilter';
import { OptionsToggles } from './filters/OptionsToggles';
import { SubredditList } from './filters/SubredditList';

interface Props {
  countsBySub: Record<string, number>;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ countsBySub, isOpen, onClose }: Props) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed md:sticky top-0 md:top-[97px] left-0 h-screen md:h-[calc(100vh-97px)] w-70 flex-shrink-0 bg-bg2 border-r border-white/5 overflow-y-auto z-30 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ width: '270px' }}
      >
        <SortSelect />
        <PriceRange />
        <DateFilter />
        <OptionsToggles />
        <SubredditList countsBySub={countsBySub} />
      </aside>
    </>
  );
}