import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createCustomer,
  deleteCustomer,
  getCustomerById,
  updateCustomer,
  type CustomerInput,
} from "../services/customer.service";

export const customerQueryKeys = {
  all: ["customers"] as const,

  detail: (customerId: number) =>
    ["customers", customerId] as const,
};

export function useCustomer(
  customerId: number | undefined,
) {
  const validCustomerId =
    customerId !== undefined &&
    Number.isInteger(customerId) &&
    customerId > 0;

  return useQuery({
    queryKey: customerQueryKeys.detail(
      customerId ?? 0,
    ),

    queryFn: () =>
      getCustomerById(
        customerId as number,
      ),

    enabled: validCustomerId,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomer,

    onSuccess: async (customer) => {
      queryClient.setQueryData(
        customerQueryKeys.detail(
          customer.id,
        ),
        customer,
      );

      await queryClient.invalidateQueries({
        queryKey:
          customerQueryKeys.all,
      });
    },
  });
}

type UpdateCustomerMutationInput = {
  customerId: number;
  customer: CustomerInput;
};

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      customer,
    }: UpdateCustomerMutationInput) =>
      updateCustomer(
        customerId,
        customer,
      ),

    onSuccess: async (customer) => {
      queryClient.setQueryData(
        customerQueryKeys.detail(
          customer.id,
        ),
        customer,
      );

      await queryClient.invalidateQueries({
        queryKey:
          customerQueryKeys.all,
      });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomer,

    onSuccess: async (
      _data,
      customerId,
    ) => {
      queryClient.removeQueries({
        queryKey:
          customerQueryKeys.detail(
            customerId,
          ),
      });

      await queryClient.invalidateQueries({
        queryKey:
          customerQueryKeys.all,
      });
    },
  });
}