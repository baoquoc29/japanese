import React from 'react';
import { type PrintOptions } from './PrintPracticeSetup';
import './print.css';

interface PrintablePreviewProps {
  category: 'kanji' | 'vocab';
  selectedItemsData: any[]; // The fully populated objects from the search services
  options: PrintOptions;
}

export const PrintablePreview: React.FC<PrintablePreviewProps> = ({
  category,
  selectedItemsData,
  options,
}) => {
  // Helper to chunk an array into pages to guarantee perfect A4 pagination
  const chunkArray = (array: any[], size: number) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  // Kanji: We fit 8 rows per A4 page beautifully
  // Vocab: We fit 5 vocabulary blocks per A4 page beautifully (with lines)
  const itemsPerPage = category === 'kanji' ? 8 : 5;
  const pages = chunkArray(selectedItemsData, itemsPerPage);

  if (selectedItemsData.length === 0) {
    return (
      <div className="bg-neutral-50 dark:bg-zinc-950/60 border border-dashed border-neutral-300 dark:border-neutral-850 rounded-2xl p-16 text-center text-neutral-450 dark:text-neutral-500">
        <p className="text-xs">Chưa có mục nào được chọn. Hãy chọn các chữ bên trái để xem trước bản in.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" id="printable-area">
      <div className="flex justify-between items-center no-print pb-2">
        <h3 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          Bản xem trước trang in (A4 Portrait) - {pages.length} trang
        </h3>
        <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
          Chỉ in các trang này khi bấm nút
        </span>
      </div>

      {/* Render each chunk as an isolated printable A4 sheet */}
      {pages.map((pageItems, pageIdx) => (
        <div key={pageIdx} className="printable-page animate-fade-in">
          {/* Header on every A4 page */}
          <div className="flex justify-between items-center border-b border-neutral-300 pb-3 mb-6">
            <div>
              <h1 className="text-base font-bold tracking-tight text-neutral-900 font-display uppercase">
                {category === 'kanji' ? 'Phiếu luyện viết Kanji Nhật Ngữ' : 'Phiếu học từ vựng tiếng Nhật'}
              </h1>
              <p className="text-[9px] text-neutral-500 mt-0.5">
                Nihongo Study Web • Tự học & Ôn tập JLPT
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-neutral-600 border border-neutral-300 px-2 py-0.5 rounded uppercase">
                Trang {pageIdx + 1} / {pages.length}
              </span>
            </div>
          </div>

          {/* Kanji Sheet Layout */}
          {category === 'kanji' && (
            <div className="space-y-5">
              {pageItems.map((kanji, idx) => {
                const totalCells = Math.min(options.blankCellsCount + (options.includeTracing ? 2 : 0), 11);
                
                return (
                  <div key={kanji.character || idx} className="flex border border-neutral-200 rounded-lg overflow-hidden">
                    {/* Showcase Block */}
                    <div className="w-24 bg-neutral-50 p-2.5 flex flex-col items-center justify-center border-r border-neutral-200 select-none text-center">
                      <span className="text-3xl font-bold font-display text-neutral-950">
                        {kanji.character}
                      </span>
                      {options.includeMeanings && (
                        <span className="text-[9px] font-bold text-indigo-700 uppercase mt-1 truncate max-w-full">
                          {kanji.meanings_vi?.[0] || 'Kanji'}
                        </span>
                      )}
                      <span className="text-[8px] text-neutral-500 mt-0.5">
                        {kanji.stroke_count} nét • {kanji.jlpt}
                      </span>
                    </div>

                    {/* Writing Grid Column */}
                    <div className="flex-1 p-3 flex flex-col justify-center">
                      {options.includeMeanings && (
                        <div className="mb-2 text-[9px] text-neutral-600 flex flex-wrap gap-x-2">
                          <span className="font-bold">Onyomi:</span> <span>{kanji.on_readings?.join(', ') || '---'}</span>
                          <span className="font-bold ml-1">Kunyomi:</span> <span>{kanji.kun_readings?.join(', ') || '---'}</span>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap">
                        {/* Always show the first card character as reference */}
                        <div className="kanji-grid-cell font-bold text-neutral-900 border-neutral-400 bg-neutral-50">
                          {kanji.character}
                        </div>

                        {/* Rendering cells */}
                        {Array.from({ length: totalCells }).map((_, cellIdx) => {
                          const isTrace = options.includeTracing && cellIdx < 2;
                          return (
                            <div
                              key={cellIdx}
                              className={`kanji-grid-cell ${isTrace ? 'kanji-trace-char' : ''}`}
                            >
                              {isTrace ? kanji.character : ''}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Vocabulary Sheet Layout */}
          {category === 'vocab' && (
            <div className="space-y-6">
              {pageItems.map((vocab, idx) => (
                <div key={vocab.id || idx} className="border border-neutral-200 rounded-xl p-4 space-y-3">
                  {/* Word Header */}
                  <div className="flex justify-between items-baseline border-b border-neutral-100 pb-1.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-neutral-950 font-display">
                        {vocab.word}
                      </span>
                      <span className="text-xs text-neutral-550">
                        【{vocab.reading}】
                      </span>
                    </div>
                    {options.includeMeanings && (
                      <span className="text-xs font-bold text-indigo-700">
                        {vocab.meanings_vi?.slice(0, 2).join(', ')}
                      </span>
                    )}
                  </div>

                  {/* Writing space */}
                  <div className="vocab-practice-lines">
                    {Array.from({ length: options.blankCellsCount }).map((_, lineIdx) => {
                      const isTraceLine = options.includeTracing && lineIdx === 0;
                      return (
                        <div key={lineIdx} className="vocab-practice-line flex items-center">
                          {isTraceLine && (
                            <span className="text-neutral-200 text-sm font-light select-none pl-3 tracking-widest font-display">
                              {vocab.word} {vocab.word} {vocab.word}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Printable page Footer */}
          <div className="absolute bottom-5 left-10 right-10 flex justify-between items-center text-[8px] text-neutral-450 border-t border-neutral-200 pt-2">
            <span>Học tiếng Nhật chủ động • Luyện viết tay rèn ký tự</span>
            <span>Bản in tạo từ Nihongo Study Web</span>
          </div>
        </div>
      ))}
    </div>
  );
};
