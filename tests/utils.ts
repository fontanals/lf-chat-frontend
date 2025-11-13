import { Chat } from "../src/models/entities/chat";
import { Document } from "../src/models/entities/document";
import { Message } from "../src/models/entities/message";
import { Project } from "../src/models/entities/project";
import { User } from "../src/models/entities/user";
import { ApplicationResponse } from "../src/models/responses/response";
import { ApplicationError } from "../src/utils/errors";

type CreateTestDataRequest = {
  users?: (User & { password: string })[];
  projects?: Project[];
  chats?: Chat[];
  messages?: Message[];
  documents?: (Document & { content: string })[];
};

type CreateTestDataResponse = ApplicationResponse<boolean>;

type ClearTestDataResponse = ApplicationResponse<boolean>;

export async function createTestData(
  request: CreateTestDataRequest
): Promise<CreateTestDataResponse> {
  const fetchResponse = await fetch("http://localhost:3000/api/__test__/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const response = (await fetchResponse.json()) as CreateTestDataResponse;

  if (!response.success) {
    throw ApplicationError.copy(response.error);
  }

  return response;
}

export async function clearTestData(): Promise<ClearTestDataResponse> {
  const fetchResponse = await fetch("http://localhost:3000/api/__test__/data", {
    method: "DELETE",
  });

  const response = (await fetchResponse.json()) as ClearTestDataResponse;

  if (!response.success) {
    throw ApplicationError.copy(response.error);
  }

  return response;
}
