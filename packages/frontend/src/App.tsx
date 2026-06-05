import { BrowserRouter, Routes, Route } from 'react-router';
import { AppLayout } from './layouts/AppLayout';
import { PlayPage } from './pages/PlayPage/PlayPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<PlayPage />} />
          <Route path="play" element={<PlayPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
