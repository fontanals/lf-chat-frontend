import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Fragment } from "react";
import { Message, UserContentBlock } from "../../models/entities/message";
import { IconButton } from "../ui/button";
import { Text } from "../ui/text";
import { AssistantMessageComponent } from "./assistant-message";
import { UserMessageComponent } from "./user-message";

export type ChatMessageProps = {
  messageIds: string[];
  message: Message;
  onSelect: (messageId: string) => void;
  onEdit: (
    content: UserContentBlock[],
    parentMessageId?: string | null
  ) => void;
  isStreaming?: boolean;
};

export function ChatMessage(props: ChatMessageProps) {
  const messageIndex = props.messageIds.findIndex(
    (messageId) => messageId === props.message.id
  );

  if (props.message.role === "user") {
    return (
      <UserMessageComponent
        message={props.message}
        onEdit={props.onEdit}
        additionalActions={
          props.messageIds.length > 1 && (
            <Fragment>
              <IconButton
                onClick={() =>
                  props.onSelect(props.messageIds[messageIndex - 1])
                }
                disabled={messageIndex <= 0}
              >
                <ChevronLeftIcon size="16px" />
              </IconButton>
              <Text>
                {messageIndex + 1}/{props.messageIds.length}
              </Text>
              <IconButton
                onClick={() =>
                  props.onSelect(props.messageIds[messageIndex + 1])
                }
                disabled={messageIndex >= props.messageIds.length - 1}
              >
                <ChevronRightIcon size="16px" />
              </IconButton>
            </Fragment>
          )
        }
      />
    );
  }

  return (
    <AssistantMessageComponent
      message={props.message}
      isStreaming={props.isStreaming}
    />
  );
}
