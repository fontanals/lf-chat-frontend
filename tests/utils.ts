import { Chat } from "../src/models/entities/chat";
import { Document } from "../src/models/entities/document";
import { Message } from "../src/models/entities/message";
import { Project } from "../src/models/entities/project";
import { User } from "../src/models/entities/user";
import { ApplicationResponse } from "../src/models/responses/response";
import { ApplicationError } from "../src/utils/errors";

type GetUsersQuery = {
  email?: string;
};

type CreateTestDataRequest = {
  users?: (User & {
    password: string;
    verificationToken?: string | null;
    recoveryToken?: string | null;
    isVerified?: boolean;
  })[];
  projects?: Project[];
  chats?: Chat[];
  messages?: Message[];
  documents?: (Document & { content: string })[];
};

type CreateTestDataResponse = boolean;

type GetUsersResponse = (User & {
  verificationToken?: string | null;
  recoveryToken?: string | null;
  isVerified?: boolean;
})[];

type ClearTestDataResponse = boolean;

export async function getUsers(
  query: GetUsersQuery
): Promise<GetUsersResponse> {
  const searchParams = new URLSearchParams(query);

  const fetchResponse = await fetch(
    `${
      process.env.VITE_API_BASE_URL
    }/__test__/data/users?${searchParams.toString()}`
  );

  const response =
    (await fetchResponse.json()) as ApplicationResponse<GetUsersResponse>;

  if (!response.success) {
    throw ApplicationError.copy(response.error);
  }

  return response.data;
}

export async function createTestData(
  request: CreateTestDataRequest
): Promise<CreateTestDataResponse> {
  const fetchResponse = await fetch(
    `${process.env.VITE_API_BASE_URL}/__test__/data`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    }
  );

  const response =
    (await fetchResponse.json()) as ApplicationResponse<CreateTestDataResponse>;

  if (!response.success) {
    throw ApplicationError.copy(response.error);
  }

  return response.data;
}

export async function clearTestData(): Promise<ClearTestDataResponse> {
  const fetchResponse = await fetch(
    `${process.env.VITE_API_BASE_URL}/__test__/data`,
    { method: "DELETE" }
  );

  const response =
    (await fetchResponse.json()) as ApplicationResponse<ClearTestDataResponse>;

  if (!response.success) {
    throw ApplicationError.copy(response.error);
  }

  return response.data;
}
