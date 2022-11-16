import * as yup from 'yup';
import { FC, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Candidate, ServerValidationErrors } from 'common/models';
import { addServerErrors } from 'common/error/utilities';
import WithUnsavedChangesPrompt from 'common/components/WithUnsavedChangesPrompt';
import { yupResolver } from '@hookform/resolvers/yup';

export type FormData = Pick<Candidate, 'name' | 'email' | 'department'>;

export type Props = {
    defaultValues?: FormData;
    submitButtonLabel?: string;
    cancelButtonLabel?: string;
    onSubmit: (data: FormData) => void;
    onCancel: () => void;
    serverValidationErrors: ServerValidationErrors<FormData> | null;
};

const isBlank = (val:string) => !val || !val.trim();
const notBlank = (val:string) => !isBlank(val);

const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email().required('Email is required'),
    department: yup.number(),
});

export const CandidateDetailForm: FC<Props> = ({
    defaultValues = {},
    onSubmit,
    submitButtonLabel = 'Submit',
    serverValidationErrors
}) => {
    const {
        register,
        formState: { errors, isValid, isDirty, isSubmitting, isSubmitted },
        handleSubmit,
        trigger,
        control,
        watch,
        setError,
      } = useForm<FormData>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            ...defaultValues
            // TODO: adjust default department dropdown
        }
      });

      useEffect(() => {
        if (serverValidationErrors) {
          addServerErrors(serverValidationErrors, setError);
        }
      }, [serverValidationErrors, setError]);

      return (
        <WithUnsavedChangesPrompt when={isDirty && !(isSubmitting || isSubmitted)}>

        </WithUnsavedChangesPrompt>
      );
}