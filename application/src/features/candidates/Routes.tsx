import { Layout } from 'common/components/Layout';
import { NotFoundView } from 'common/components/NotFoundView';
import { CandidateListView, CreateCandidateView } from 'features/candidates/pages';
import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

export const CandidateRoutes: FC = () => (
  <Layout>
    <Routes>
      <Route path="/create-candidate" element={<CreateCandidateView />} />
      <Route path='/' element={<CandidateListView />} />
      <Route path='/*' element={<NotFoundView />} />
    </Routes>
  </Layout>
);
``