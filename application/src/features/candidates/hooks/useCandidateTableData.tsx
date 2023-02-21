import { Column } from 'react-table';
import { useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { ActionButton, ActionButtonProps } from 'common/styles/button';
import { Candidate } from 'common/models';
import { useDeleteCandidateMutation } from 'common/api/candidateApi';
import * as notificationService from 'common/services/notification';

import { useConfirmationModal } from 'features/confirmation-modal';
import { useRbac } from 'features/rbac';

export type CandidateTableItem = {
    id: number;
    name: string;
    email: string;
    department: {
        deptName: string;
        contact: string;
        contactEmail: string;
    }
    actions: ActionButtonProps[];
};

export type UseCandidateTableData = (candidates?: Candidate[]) => {
    columns: Column<CandidateTableItem>[];
    data: CandidateTableItem[];
};

export const useCandidateTableData: UseCandidateTableData = (candidates = []) => {
    const [deleteCandidate] = useDeleteCandidateMutation();
    const { openModal } = useConfirmationModal();
    const { userHasPermission } = useRbac();
    const navigate = useNavigate();

    const handleNavigate = (candidate: Candidate) => {
        navigate(`dashboard/${candidate.id}`);
    }

    const handleDelete = useCallback((candidate: Candidate) => {
        const message = `Delete ${candidate.name}?`;
        const onConfirm = async () => {
            await deleteCandidate(candidate.id);
            notificationService.showSuccessMessage('Candidate Deleted');
        };

        openModal({ message, confirmButtonLabel: 'DELETE', onConfirm });
    }, [openModal, deleteCandidate]);

    // Set up columns/headers
    const columns: Column<CandidateTableItem>[] = useMemo(
        () => [
           { accessor: 'name', Header: 'Candidate Name' },
           { accessor: 'email', Header: 'Email' },
           { accessor: 'department', Header: 'department', Cell: ({ value }) => <span>{value.deptName}</span>},
           {
            accessor: 'actions',
            Header: '',
            Cell: ({ value: actions }) => (
                <>
                    {actions.map(action => (
                        <ActionButton key={action.text} {...action} />
                    ))}
                </>
            ), disableSortBy: true,
           }
        ],
        [],
    );

    const data: CandidateTableItem[] = useMemo(
        () => {
            return candidates.map(candidate => ({
                id: candidate.id,
                name: candidate.name,
                email: candidate.email,
                department: candidate.department,
                actions: [{
                    text: 'Delete',
                    onClick: e => {
                        e.stopPropagation();
                        handleDelete(candidate);
                    },
                    show: userHasPermission({ permission: 'agent:delete', data: candidate })
                }
                ,{
                    text: 'Dashboard',
                    actionId: candidate.id,
                    onClick: e => {
                        e.stopPropagation();
                        handleNavigate(candidate)
                    },
                    show: userHasPermission({ permission: 'agent:read', data: candidate })
                }
            ]
        }))},
        [candidates, userHasPermission, handleDelete],
    );

    return {
        columns,
        data,
    };
}