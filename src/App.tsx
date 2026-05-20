import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { KanjiList } from './features/kanji/pages/KanjiList';
import { KanjiDetail } from './features/kanji/pages/KanjiDetail';
import { VocabularyList } from './features/vocabulary/pages/VocabularyList';
import { GrammarList } from './features/grammar/pages/GrammarList';
import { GrammarDetail } from './features/grammar/pages/GrammarDetail';
import { WritingPage } from './features/writing/pages/WritingPage';
import { QuizPage } from './features/quiz/pages/QuizPage';
import { FavoritesPage } from './features/favorites/pages/FavoritesPage';
import { KanjiTestPage } from './features/kanji-test/KanjiTestPage';
import { FlashcardsPage } from './features/flashcards/FlashcardsPage';
import { PrintPracticePage } from './features/print-practice/PrintPracticePage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kanji" element={<KanjiList />} />
          <Route path="/kanji/:character" element={<KanjiDetail />} />
          <Route path="/vocabulary" element={<VocabularyList />} />
          <Route path="/grammar" element={<GrammarList />} />
          <Route path="/grammar/:id" element={<GrammarDetail />} />
          <Route path="/writing" element={<WritingPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/kanji-test" element={<KanjiTestPage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/print-practice" element={<PrintPracticePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
