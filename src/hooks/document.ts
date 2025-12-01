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
  status: "uploading" | "complete";
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
          status: "uploading",
        },
      }));

      uploadDocument(args, {
        onSuccess: (documentId) => {
          setUploadMap((previousUploadMap) => ({
            ...previousUploadMap,
            [documentId]: {
              ...previousUploadMap[documentId],
              status: "complete",
            },
          }));
        },
        onError: (error) => {
          setUploadMap((previousUploadMap) => {
            const uploadMap = { ...previousUploadMap };

            delete uploadMap[args.request.id];

            return uploadMap;
          });

          displayError(ApplicationError.copy(error));
        },
      });
    },
    [uploadDocument]
  );

  const deleteDocumentWithProgress = useCallback(
    (args: { params: DeleteDocumentParams }) => {
      setUploadMap((previousUploadMap) => {
        const uploadMap = { ...previousUploadMap };

        delete uploadMap[args.params.documentId];

        return uploadMap;
      });

      deleteDocument(args);
    },
    [setUploadMap, deleteDocument]
  );

  const clearUploadMap = useCallback(() => setUploadMap({}), [setUploadMap]);

  return {
    uploadMap,
    uploadDocument: uploadDocumentWithProgress,
    deleteDocument: deleteDocumentWithProgress,
    clearUploadMap,
  };
}

export function useUploadDocument(projectId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (args: { request: UploadDocumentRequest }) =>
      services.document.uploadDocument(args.request),
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
            key: "",
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
