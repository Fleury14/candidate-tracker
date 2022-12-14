import Container from 'react-bootstrap/Container';
import { Button, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Trans } from 'react-i18next';
import { FC, useMemo } from 'react';

import { PageHeader } from 'common/styles/page';
import { TableCard } from 'common/styles/card';
import { NoContent } from 'common/styles/utilities';

import { CandidateTableItem, useCandidateTableData } from '../hooks/useCandidateTableData';

import { usePSFQuery } from 'common/hooks';
import { PaginatedResult, Candidate } from 'common/models';
import { useGetCandidatesQuery } from 'common/api/candidateApi';
import { DataTable } from 'common/components/DataTable';
import { DataTableSearchAndFilters } from 'common/components/DataTable/DataTableSearchAndFilters';
import { WithLoadingOverlay } from 'common/components/LoadingSpinner';
import { StringFilter } from 'common/components/DataTable/Filters';
import { FilterInfo } from 'common/components/DataTable/FilterDropdown';
import { HasPermission } from 'features/rbac';



export const CandidateListView: FC = () => {
  const {
    data,
    isLoading,
    isFetching,
    page,
    pageSize,
    getPage,
    changePageSize,
    changeSortBy,
    addFilter,
    removeFilter,
    resetFilters,
    addSearchText,
  } = usePSFQuery<PaginatedResult<Candidate>>(useGetCandidatesQuery);
  const candidates = useMemo(() => data?.results ?? [], [data]);
  const { columns, data: tableData } = useCandidateTableData(candidates);
  const isPageLoading = isLoading;

  const filters: FilterInfo[] = useMemo(() => [
    {
      attribute: 'name',
      attributeLabel: 'Name',
      FilterUI: StringFilter(),
    }
  ], []);

  return (
    <Container>
      <PageHeader>
        <div>
          <h1>
            <Trans i18nKey='candidateList.heading'>Candidate List</Trans>
          </h1>
        </div>

        <DataTableSearchAndFilters
          filters={filters}
          onSetFilter={addFilter}
          onRemoveFilter={removeFilter}
          onClearFilters={resetFilters}
          onSetSearchText={addSearchText}
        />

        <TableCard>
          <Card.Body>
            <WithLoadingOverlay
              isLoading={isPageLoading || isFetching}
              isInitialLoad={isPageLoading && isFetching}
              containerHasRoundedCorners
              containerBorderRadius='6px'
            >
              {data?.meta.count != 0 ? (
                <DataTable<CandidateTableItem>
                  columns={columns}
                  data={tableData}
                  onRowClick={() => {}}
                  pagination={{
                    basePage: 1,
                    page,
                    pageSize,
                    count: data?.meta.count || 0,
                    pageCount: data?.meta.pageCount || 0,
                    pageSizeOptions: [5, 10, 25, 50, 100],
                    onPageChange: getPage,
                    onPageSizeChange: changePageSize
                  }}
                  sorting={{
                    onSortByChange: changeSortBy
                  }}
                  />
              ) : (
                <NoContent>
                  <FontAwesomeIcon className='text-muted' size='2x' icon={['fas', 'stethoscope']} />
                  <p className='lead mb-0'>No Candidates</p>
                </NoContent>
              )}
            </WithLoadingOverlay>
          </Card.Body>
        </TableCard>
      </PageHeader>
    </Container>
  )
}