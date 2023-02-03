import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGetCandidateByIdQuery, useGetDepartmentsQuery, useUpdateCandidateMutation } from 'common/api/candidateApi';
import { isFetchBaseQueryError } from 'common/api/handleApiError';
import { WithLoadingOverlay } from 'common/components/LoadingSpinner';
import { isObject } from 'common/error/utilities';
import { usePSFQuery } from 'common/hooks';
import { Department, Candidate, PaginatedResult, ServerValidationErrors } from 'common/models';
import * as notificationService from 'common/services/notification';
import { PageCrumb, SmallContainer, PageHeader } from 'common/styles/page';
import { FC, useEffect, useMemo, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';

import { CandidateDetailForm, FormData, CandidateFormData } from '../components/candidateDetailForm';

export type RouteParams = {
    id: string;
};

export const UpdateCandidateView: FC = () => {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const [updateCandidate] = useUpdateCandidateMutation();
  const { data: candidate, isLoading: isLoadingCandidate, isFetching, error } = useGetCandidateByIdQuery(id!);
  const [formValidationErrors, setFormValidationErrors] = useState<ServerValidationErrors<FormData> | null>(null)
  const deptResults = usePSFQuery<PaginatedResult<Department>>(useGetDepartmentsQuery);
  const departments = useMemo(() => deptResults.data?.results ?? [], [deptResults.data] )

  useEffect(() => {
    if (error) {
      notificationService.showErrorMessage('Unable to load candidate. Returning to candidate list.');
      navigate('/candidates', { replace: true });
    }
  }, [error, navigate]);

  const handleFormCancel = () => {
    navigate(-1);
  }
  const handleFormSubmit = async (data: FormData) => {
    const updateRequest = { id: Number(id), ...data };
    try {
      await updateCandidate(updateRequest).unwrap();
      notificationService.showSuccessMessage('Candidate updated');
      navigate('/candidates');
    } catch (error) {
      notificationService.showErrorMessage('Unable to update candidate');
      if (error && isFetchBaseQueryError(error)) {
        if (isObject(error.data)) {
          setFormValidationErrors(error.data);
        }
      } else {
        throw error;
      }
    }
  };

  const handleCandidateData = (candidate: Candidate | undefined) => {
    const result: CandidateFormData | undefined = candidate && candidate.department && candidate.department.id ?
    {
      id: candidate.id,
      name: candidate.name,
      email: candidate.email,
      department: candidate.department.id
    } :
    undefined;
    return result;
  }

  return (
    <SmallContainer>
      <PageCrumb>
        <Link to='/candidates'>
          <FontAwesomeIcon icon={['fas', 'chevron-left']} /> Back to Candidate List
        </Link>
      </PageCrumb>
      <PageHeader>
        <div>
          <h1>Edit Candidate</h1>
          <p className="text-muted">Update this candidate's details here.</p>
        </div>
      </PageHeader>
      <Card>
        <Card.Body>
          <WithLoadingOverlay
            isInitialLoad={isLoadingCandidate && isFetching}
            isLoading={isLoadingCandidate}
            containerHasRoundedCorners
            containerBorderRadius='6px'
          >
            {!isLoadingCandidate ? (
              <CandidateDetailForm
                defaultValues={handleCandidateData(candidate)}
                submitButtonLabel='Save'
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                serverValidationErrors={formValidationErrors}
                departmentList={departments}
              />
            ) : null}
          </WithLoadingOverlay>
        </Card.Body>
      </Card>
    </SmallContainer>
  );

}