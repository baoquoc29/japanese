import React, { useState, useEffect } from 'react';
import { useKanji } from '../../hooks/useKanji';
import { useVocabulary } from '../../hooks/useVocabulary';
import { PrintPracticeSetup, type PrintOptions } from './PrintPracticeSetup';
import { PrintablePreview } from './PrintablePreview';
import { type JlptFilterLevel } from '../../constants/jlpt';

export const PrintPracticePage: React.FC = () => {
  const { kanjiList, loading: kanjiLoading } = useKanji();
  const { vocabList, loading: vocabLoading } = useVocabulary();

  const [category, setCategory] = useState<'kanji' | 'vocab'>('kanji');
  const [selectedLevel, setSelectedLevel] = useState<JlptFilterLevel>('ALL');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [options, setOptions] = useState<PrintOptions>({
    blankCellsCount: 10,
    includeTracing: true,
    includeMeanings: true,
    columnsCount: 10,
  });

  // Automatically reset selected items when category or level shifts
  useEffect(() => {
    setSelectedItems([]);
  }, [category, selectedLevel]);

  const isLoading = kanjiLoading || vocabLoading;

  // Filter lists based on chosen JLPT Level
  const getFilteredItems = () => {
    if (category === 'kanji') {
      return selectedLevel === 'ALL'
        ? kanjiList
        : kanjiList.filter((k) => k.jlpt === selectedLevel);
    } else {
      return selectedLevel === 'ALL'
        ? vocabList
        : vocabList.filter((v) => v.jlpt === selectedLevel);
    }
  };

  const filteredItems = getFilteredItems();

  // Retrieve full items objects for selected IDs to render in preview
  const getSelectedItemsData = () => {
    if (category === 'kanji') {
      return kanjiList.filter((k) => selectedItems.includes(k.character));
    } else {
      return vocabList.filter((v) => selectedItems.includes(v.id));
    }
  };

  const selectedItemsData = getSelectedItemsData();

  const handlePrintTrigger = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2 border-b border-neutral-200 dark:border-neutral-800 pb-5 no-print">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-display">
          In phiếu tập viết tiếng Nhật
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Tùy chỉnh và tải xuống mẫu tập viết Kanji ô vuông có nét đứt hoặc phiếu từ vựng kẻ dòng chuyên nghiệp khổ A4.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-neutral-400 dark:text-neutral-500 animate-pulse no-print">
          Đang tải dữ liệu in ấn...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Setup controls on left (span 4/12) */}
          <div className="lg:col-span-4 no-print">
            <PrintPracticeSetup
              category={category}
              setCategory={setCategory}
              selectedLevel={selectedLevel}
              setSelectedLevel={setSelectedLevel}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              availableItems={filteredItems}
              options={options}
              setOptions={setOptions}
              onPrint={handlePrintTrigger}
            />
          </div>

          {/* Paper A4 live preview on right (span 8/12) */}
          <div className="lg:col-span-8 w-full overflow-x-auto lg:overflow-x-visible pb-10">
            <PrintablePreview
              category={category}
              selectedItemsData={selectedItemsData}
              options={options}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintPracticePage;
