import { FC } from 'react';
import Container from 'react-bootstrap/Container';
import { Trans } from 'react-i18next';

import { PageHeader } from 'common/styles/page';

export const CandidateDashboardView: FC = () => {
  return (
      <Container>
        <PageHeader>
          <div>
            <h1>
              <Trans>Candidate Dashboard</Trans>
            </h1>
            <p>
              <Trans>Detailed Candidate Information</Trans>
            </p>
          </div>
        </PageHeader>
      </Container>
  );
}