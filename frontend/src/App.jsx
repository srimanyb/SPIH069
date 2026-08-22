import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import RequestDetail from './pages/RequestDetail';
import Bottlenecks from './pages/Bottlenecks';
import RequestsList from './pages/RequestsList';
import Upload from './pages/Upload';
import Reports from './pages/Reports';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="requests" element={<RequestsList />} />
          <Route path="requests/:id" element={<RequestDetail />} />
          <Route path="at-risk" element={<RequestsList filterRisk="HIGH" />} />
          <Route path="bottlenecks" element={<Bottlenecks />} />
          <Route path="reports" element={<Reports />} />
          <Route path="upload" element={<Upload />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
