import {
    type ApiCreateCustomExplore,
    type ApiError,
    type CreateCustomExplorePayload,
} from '@lightdash/common';
import { IconArrowRight } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { lightdashApi } from '../../../api';
import useToaster from '../../../hooks/toaster/useToaster';

const createCustomExplore = async ({
    projectUuid,
    name,
    sql,
    columns,
}: {
    projectUuid: string;
} & CreateCustomExplorePayload) =>
    lightdashApi<ApiCreateCustomExplore['results']>({
        url: `/projects/${projectUuid}/sqlRunner/create-custom-explore`,
        method: 'POST',
        body: JSON.stringify({
            name,
            sql,
            columns,
        }),
    });

/**
 * Create a virtual view (a.k.a. custom explore) - users can query from them in the Explore view
 */
export const useCreateCustomExplore = ({
    projectUuid,
}: {
    projectUuid: string;
}) => {
    const { showToastSuccess, showToastError } = useToaster();
    return useMutation<
        ApiCreateCustomExplore['results'],
        ApiError,
        {
            projectUuid: string;
        } & CreateCustomExplorePayload
    >({
        mutationFn: createCustomExplore,
        onSuccess: (data) => {
            showToastSuccess({
                title: 'Success! Virtual view created',
                action: {
                    children: 'Query from new virtual view',
                    icon: IconArrowRight,
                    onClick: () => {
                        window.open(
                            `/projects/${projectUuid}/tables/${data.name}`,
                            '_blank',
                        );
                    },
                },
            });
        },
        onError: () => {
            showToastError({
                title: 'Error creating virtual view',
            });
        },
    });
};
