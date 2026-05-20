import React, { useState } from 'react';
import { type JlptFilterLevel } from '../../constants/jlpt';

export interface PrintOptions {
  blankCellsCount: number;
  includeTracing: boolean;
  includeMeanings: boolean;
  columnsCount: number; // For kanji grids layout
}

interface PrintPracticeSetupProps {
  category: 'kanji' | 'vocab';
  setCategory: (cat: 'kanji' | 'vocab') => void;
  selectedLevel: JlptFilterLevel;
  setSelectedLevel: (level: JlptFilterLevel) => void;
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  availableItems: any[]; // Kanji[] or Vocabulary[]
  options: PrintOptions;
  setOptions: React.Dispatch<React.SetStateAction<PrintOptions>>;
  onPrint: () => void;
}

export const PrintPracticeSetup: React.FC<PrintPracticeSetupProps> = ({
  category,
  setCategory,
  selectedLevel,
  setSelectedLevel,
  selectedItems,
  setSelectedItems,
  availableItems,
  options,
  setOptions,
  onPrint,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter available items based on search query
  const filteredItems = availableItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    
    if (category === 'kanji') {
      const char = item.character || '';
      const hanyu = (item.meanings_vi || []).join(' ').toLowerCase();
      const readings = [...(item.on_readings || []), ...(item.kun_readings || [])].join(' ').toLowerCase();
      return char.toLowerCase().includes(query) || hanyu.includes(query) || readings.includes(query);
    } else {
      const word = item.word || '';
      const readings = item.reading || '';
      const meanings = (item.meanings_vi || []).join(' ').toLowerCase();
      return word.toLowerCase().includes(query) || readings.toLowerCase().includes(query) || meanings.includes(query);
    }
  });

  const handleToggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const allFilteredIds = filteredItems.map((item) =>
      category === 'kanji' ? item.character : item.id
    );
    setSelectedItems((prev) => {
      // Add only unique items
      const next = new Set([...prev, ...allFilteredIds]);
      return Array.from(next);
    });
  };

  const handleDeselectAll = () => {
    const allFilteredIds = filteredItems.map((item) =>
      category === 'kanji' ? item.character : item.id
    );
    setSelectedItems((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 space-y-6 print-setup-panel h-fit">
      <div>
        <h2 className="text-sm font-bold text-neutral-850 dark:text-neutral-200 uppercase tracking-wider mb-4">
          Cấu hình in tập viết
        </h2>

        {/* Category Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 dark:bg-neutral-850 rounded-xl mb-4">
          <button
            onClick={() => {
              setCategory('kanji');
              setSelectedItems([]);
            }}
            className={`py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              category === 'kanji'
                ? 'bg-white dark:bg-zinc-900 text-neutral-900 dark:text-neutral-50 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-850 dark:text-neutral-450 dark:hover:text-neutral-200'
            }`}
          >
            Luyện Kanji
          </button>
          <button
            onClick={() => {
              setCategory('vocab');
              setSelectedItems([]);
            }}
            className={`py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
              category === 'vocab'
                ? 'bg-white dark:bg-zinc-900 text-neutral-900 dark:text-neutral-50 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-850 dark:text-neutral-450 dark:hover:text-neutral-200'
            }`}
          >
            Luyện Từ vựng
          </button>
        </div>

        {/* JLPT Selector */}
        <div className="space-y-1.5 mb-4">
          <label className="text-[11px] font-bold text-neutral-450 dark:text-neutral-500 uppercase tracking-wider">
            Cấp độ JLPT
          </label>
          <div className="flex gap-1.5 flex-wrap">
            {(['ALL', 'N5', 'N4', 'N3', 'N2', 'N1'] as JlptFilterLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  setSelectedLevel(lvl);
                  setSelectedItems([]);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                  selectedLevel === lvl
                    ? 'bg-neutral-900 border-neutral-900 text-white dark:bg-neutral-50 dark:border-neutral-50 dark:text-neutral-950 shadow-sm'
                    : 'bg-white border-neutral-200 text-neutral-500 hover:text-neutral-800 dark:bg-zinc-900 dark:border-neutral-800 dark:text-neutral-450 dark:hover:text-neutral-200'
                }`}
              >
                {lvl === 'ALL' ? 'Tất cả' : lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Item Checklist selection */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-bold text-neutral-450 dark:text-neutral-500 uppercase tracking-wider">
            Chọn từ bài học ({selectedItems.length} đã chọn)
          </label>
          <div className="flex gap-2">
            <button
              onClick={handleSelectAll}
              disabled={filteredItems.length === 0}
              className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer disabled:opacity-50 disabled:no-underline"
            >
              Chọn tất cả
            </button>
            <span className="text-neutral-300 dark:text-neutral-750 text-[10px]">|</span>
            <button
              onClick={handleDeselectAll}
              disabled={selectedItems.length === 0}
              className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer disabled:opacity-50 disabled:no-underline"
            >
              Bỏ chọn tất cả
            </button>
          </div>
        </div>

        {/* Search within items */}
        <input
          type="text"
          placeholder="Tìm kiếm nhanh..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs text-neutral-850 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-neutral-350 dark:focus:border-neutral-700"
        />

        <div className="max-h-56 overflow-y-auto border border-neutral-200 dark:border-neutral-800 rounded-xl divide-y divide-neutral-100 dark:divide-neutral-850 pr-1 select-none">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400 dark:text-neutral-550">
              Không tìm thấy mục phù hợp
            </div>
          ) : (
            filteredItems.map((item) => {
              const id = category === 'kanji' ? item.character : item.id;
              const isChecked = selectedItems.includes(id);
              const label = category === 'kanji' ? item.character : item.word;
              const details =
                category === 'kanji'
                  ? (item.meanings_vi || []).join(', ')
                  : item.reading + ' - ' + (item.meanings_vi || []).join(', ');

              return (
                <label
                  key={id}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-850/40 cursor-pointer text-xs"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleItem(id)}
                    className="h-3.5 w-3.5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 dark:border-neutral-700 dark:bg-neutral-950"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-1">
                      <span className="font-bold text-neutral-850 dark:text-neutral-100">
                        {label}
                      </span>
                      <span className="text-[9px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 px-1 py-0.2 rounded uppercase">
                        {item.jlpt}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-450 dark:text-neutral-550 truncate">
                      {details}
                    </p>
                  </div>
                </label>
              );
            })
          )}
        </div>
      </div>

      {/* Form Options */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-4">
        <label className="text-[11px] font-bold text-neutral-450 dark:text-neutral-500 uppercase tracking-wider block">
          Tùy chọn hiển thị tập viết
        </label>

        {/* Tracing Toggle */}
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
            Hiển thị chữ nét mờ để đồ theo (Trace)
          </span>
          <input
            type="checkbox"
            checked={options.includeTracing}
            onChange={(e) =>
              setOptions((prev) => ({ ...prev, includeTracing: e.target.checked }))
            }
            className="h-3.5 w-3.5 rounded border-neutral-300 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-950"
          />
        </label>

        {/* Include meaning */}
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
            Hiển thị nghĩa & phiên âm trên đầu
          </span>
          <input
            type="checkbox"
            checked={options.includeMeanings}
            onChange={(e) =>
              setOptions((prev) => ({ ...prev, includeMeanings: e.target.checked }))
            }
            className="h-3.5 w-3.5 rounded border-neutral-300 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-950"
          />
        </label>

        {/* Blank Cells configuration */}
        {category === 'kanji' ? (
          <div className="flex justify-between items-center gap-4">
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Số ô viết trống mỗi chữ
            </span>
            <select
              value={options.blankCellsCount}
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, blankCellsCount: parseInt(e.target.value, 10) }))
              }
              className="bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 text-xs px-2 py-1 rounded-lg focus:outline-none"
            >
              {[5, 10, 15, 20, 25].map((num) => (
                <option key={num} value={num}>
                  {num} ô
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex justify-between items-center gap-4">
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Số dòng viết tập mỗi từ
            </span>
            <select
              value={options.blankCellsCount}
              onChange={(e) =>
                setOptions((prev) => ({ ...prev, blankCellsCount: parseInt(e.target.value, 10) }))
              }
              className="bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 text-xs px-2 py-1 rounded-lg focus:outline-none"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} dòng
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={onPrint}
        disabled={selectedItems.length === 0}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 disabled:text-neutral-400 dark:disabled:text-neutral-600 disabled:cursor-not-allowed text-white dark:text-neutral-50 text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all hover:shadow-md"
      >
        In phiếu tập viết ({selectedItems.length} chữ)
      </button>
    </div>
  );
};
