import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

type Tab = { href: string; label: string };
interface ChipProps {
  text: Tab;
  selected: boolean;
  setSelected: (tab: Tab) => void;
}

const ChipTabs = ({ tabs }: { tabs: { href: string; label: string }[] }) => {
  const [selected, setSelected] = useState<Tab>(tabs[0]);

  return (
    <div className="px-4 py-14  flex items-center flex-wrap gap-2">
      {tabs.map((tab) => (
        <Link key={tab.href} href={tab.href}>
          <Chip
            text={tab}
            selected={selected === tab}
            setSelected={setSelected}
          />
        </Link>
      ))}
    </div>
  );
};

const Chip: React.FC<ChipProps> = ({ text, selected, setSelected }) => {
  return (
    <button
      onClick={() => setSelected(text)}
      className={`${
        selected
          ? "text-white"
          : "text-black hover:text-black hover:bg-tertiary"
      } text-sm transition-colors px-2.5 py-0.5 rounded-md relative`}
    >
      <span className="relative z-10">{text.label}</span>
      {selected && (
        <motion.span
          layoutId="pill-tab"
          transition={{ type: "spring", duration: 0.2 }}
          className="absolute inset-0 z-0 bg-primary  rounded-md"
        />
      )}
    </button>
  );
};

export default ChipTabs;