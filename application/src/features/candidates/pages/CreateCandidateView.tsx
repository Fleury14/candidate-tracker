import { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from 'react-i18next';
import { Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';


import { PageCrumb, PageHeader, SmallContainer } from 'common/styles/page';


export const CreateCandidateView: FC = () => {
  return (
    <SmallContainer>
      <PageCrumb>
        <Link to='/candidates'>
          <>
            <FontAwesomeIcon icon={['fas', 'chevron-left']} />
            <Trans i18nKey='createCandidate.back'>Back to Candidate List</Trans>
          </>
        </Link>
      </PageCrumb>

      <PageHeader>
        <div>
          <h1>
            <Trans i18nKey='createCandidate.heading'>Create Candidate</Trans>
          </h1>
          <p className='text-muted'>
            <Trans i18nKey='createCandidate.subheading'>Add a new candidate to the system.</Trans>
          </p>
        </div>
      </PageHeader>

      <Card>
        <Card.Body>
          <p>Insert Candidate Form here</p>
          {/* <UserDetailForm
            availableRoles={availableRoles}
            defaultValues={defaultValues}
            submitButtonLabel='Create'
            onSubmit={handleFormSubmit}
            serverValidationErrors={formValidationErrors}
          /> */}
        </Card.Body>
      </Card>
    </SmallContainer>
  );
}