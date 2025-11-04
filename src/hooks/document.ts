import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import {
  DeleteDocumentParams,
  UploadDocumentRequest,
} from "../models/requests/document";
import { GetProjectResponse } from "../models/responses/project";
import { services } from "../services/provider";
import { useErrorStore } from "../state/error";
import { ApplicationError } from "../utils/errors";

export type UploadItem = {
  id: string;
  name: string;
  mimetype: string;
  progress: number;
};

export type UploadMap = Record<string, UploadItem>;

export function useUploadDocuments(projectId?: string) {
  const displayError = useErrorStore((state) => state.displayError);

  const [uploadMap, setUploadMap] = useState<UploadMap>({});

  const { mutate: uploadDocument } = useUploadDocument(projectId);
  const { mutate: deleteDocument } = useDeleteDocument(projectId);

  const uploadDocumentWithProgress = useCallback(
    (args: { request: UploadDocumentRequest }) => {
      setUploadMap((uploadMap) => ({
        ...uploadMap,
        [args.request.id]: {
          id: args.request.id,
          name: args.request.file.name,
          mimetype: args.request.file.type,
          progress: 0,
        },
      }));

      uploadDocument(
        {
          request: args.request,
          onProgress: (event) => {
            const progress = Math.round((event.loaded * 100) / event.total);

            setUploadMap((uploadMap) => ({
              ...uploadMap,
              [args.request.id]: {
                id: args.request.id,
                name: args.request.file.name,
                mimetype: args.request.file.type,
                progress,
              },
            }));
          },
        },
        {
          onError: (error) => {
            setUploadMap((uploadMap) => {
              const newUploadMap = { ...uploadMap };

              delete newUploadMap[args.request.id];

              return newUploadMap;
            });

            displayError(ApplicationError.copy(error));
          },
        }
      );
    },
    [uploadDocument]
  );

  const deleteDocumentWithProgress = useCallback(
    (args: { params: DeleteDocumentParams }) => {
      setUploadMap((uploadMap) => {
        const newUploadMap = { ...uploadMap };

        delete newUploadMap[args.params.documentId];

        return newUploadMap;
      });

      deleteDocument(args);
    },
    [deleteDocument]
  );

  return {
    uploadMap,
    uploadDocument: uploadDocumentWithProgress,
    deleteDocument: deleteDocumentWithProgress,
    clearUploadMap: () => setUploadMap({}),
  };
}

export function useUploadDocument(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: {
      request: UploadDocumentRequest;
      onProgress: (event: ProgressEvent) => void;
    }) => services.document.uploadDocument(args.request, args.onProgress),
    onMutate: async (args) => {
      if (projectId == null) {
        return;
      }

      await queryClient.cancelQueries({ queryKey: ["projects", projectId] });

      const previousProject = queryClient.getQueryData<GetProjectResponse>([
        "projects",
        projectId,
      ]);

      queryClient.setQueryData<GetProjectResponse>(
        ["projects", projectId],
        (project) => {
          if (project == null) {
            return project;
          }

          const documents = project.documents?.concat({
            id: args.request.id,
            name: args.request.file.name,
            mimetype: args.request.file.type,
            sizeInBytes: args.request.file.size,
            isProcessed: false,
            chatId: null,
            projectId: project.id,
          });

          return { ...project, documents };
        }
      );

      return { previousProject };
    },
    onError: (_, __, context) => {
      if (projectId != null) {
        queryClient.setQueryData(
          ["projects", projectId],
          context?.previousProject
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
    },
  });
}

export function useDeleteDocument(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { params: DeleteDocumentParams }) =>
      services.document.deleteDocument(args.params),
    onMutate: async (args) => {
      if (projectId == null) {
        return;
      }

      await queryClient.cancelQueries({ queryKey: ["projects", projectId] });

      const previousProject = queryClient.getQueryData<GetProjectResponse>([
        "projects",
        projectId,
      ]);

      queryClient.setQueryData<GetProjectResponse>(
        ["projects", projectId],
        (project) => {
          if (project == null) {
            return project;
          }

          const documents = project.documents?.filter(
            (document) => document.id !== args.params.documentId
          );

          return { ...project, documents };
        }
      );

      return { previousProject };
    },
    onError: (_, __, context) => {
      if (projectId != null) {
        queryClient.setQueryData(
          ["projects", projectId],
          context?.previousProject
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
    },
  });
}
