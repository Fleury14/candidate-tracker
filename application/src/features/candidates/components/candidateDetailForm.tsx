import * as yup from 'yup';
import { FC, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Candidate, ServerValidationErrors, Department } from 'common/models';
import { addServerErrors } from 'common/error/utilities';
import { Button, Col, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/form';
import WithUnsavedChangesPrompt from 'common/components/WithUnsavedChangesPrompt';
import { LoadingButton } from 'common/components/LoadingButton';
import { yupResolver } from '@hookform/resolvers/yup';

export type FormData = Pick<Candidate, 'name' | 'email' | 'department'>;

export type Props = {
    defaultValues?: FormData;
    submitButtonLabel?: string;
    cancelButtonLabel?: string;
    onSubmit: (data: FormData) => void;
    onCancel: () => void;
    serverValidationErrors: ServerValidationErrors<FormData> | null;
    departmentList: Department[];
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
    serverValidationErrors,
    departmentList
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
      console.log('depts', departmentList);

      return (
        <WithUnsavedChangesPrompt when={isDirty && !(isSubmitting || isSubmitted)}>
          <Form>
            <Row className='mb-2'>
              <Col xs={12} md={6}>
                <Form.Group controlId='create-candidate-form-agent-name'>
                  <Form.Label>Name</Form.Label>
                  <Form.Control type='text' {...register('name')} isInvalid={!!errors.name} />
                  <Form.Control.Feedback type='invalid'>{errors.name?.message}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control type='email' {...register('email')} isInvalid={!!errors.email} />
                  <Form.Control.Feedback type='invalid'>{errors.email?.message}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className='mb-2'>
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Department</Form.Label>
                  <Form.Select>
                    {departmentList.map(department => {
                      return <option key={department.deptName}>{department.deptName}</option>
                    })}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <div className="mt-3">
              <LoadingButton type='submit' as={Button} disabled={isValid} loading={isSubmitting}>
                {submitButtonLabel}
              </LoadingButton>
            </div>
          </Form>
        </WithUnsavedChangesPrompt>
      );
}