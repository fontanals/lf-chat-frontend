import { Box } from "@mui/material";
import { Text } from "../components/ui/text";
import { MarkdownRenderer } from "../components/ui/markdown-renderer";
import { Link } from "../components/ui/link";

export function PrivacyPolicy() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        padding: "64px",
        backgroundColor: "background.paper",
      }}
    >
      <Link to="/new">
        <Text sx={{ fontWeight: "bold", color: "secondary.main" }} variant="h5">
          LF CHAT
        </Text>
      </Link>
      <Text sx={{ fontWeight: "bold", color: "secondary.main" }} variant="h6">
        Privacy Policy
      </Text>
      <MarkdownRenderer
        content={`**Last updated:** November 30, 2025
          
LF Chat is a personal portfolio project created by **Lucas Fontana** (“we”, “us”, “our”). 

This Privacy Policy explains what data is processed when users interact with the application.

LF Chat is provided solely for demonstration purposes. Sign-ups are disabled, and only a **shared demo account** is available for testing.

For privacy or data questions, you may contact: lucasfontanasv@gmail.com

## **1. What Data We Process**

LF Chat only processes data that users enter directly into the demo account, including:

- Chat messages
- Project names, descriptions, and settings  
- Uploaded documents (**TXT, PDF**)
- Embeddings and metadata generated for retrieval
- One essential HTTP-only authentication cookie
- A global “total tokens used” counter for operational API usage limits (not linked to any user)

We do **not** collect analytics, advertising data, usage tracking, or any information that identifies individual users.

## **2. Important Warning — Do Not Enter Personal or Sensitive Data**

LF Chat is a public demo environment. 

Users **must not** input or upload:

- Personal data about themselves or others 
- Sensitive data (health information, biometrics, political opinions, etc.)
- Confidential, private, or proprietary documents

Any information entered into the demo account may be visible to anyone using it.

## **3. How Your Data Is Used**

Information entered into LF Chat is used only to provide the app’s functionality, including:

- Generating AI responses
- Context-aware retrieval (RAG) using your uploaded files 
- Managing chats, messages, and projects
- Handling document uploads
- Enforcing a monthly usage limit through a **global token counter** (not associated with individual users)

We use the **OpenAI API** to generate responses. User inputs may be sent to OpenAI for processing.

OpenAI acts as a data processor under its standard **Data Processing Addendum (DPA)**. 

We do **not** use your data to train our own models.

## **4. Where Data Is Stored**

The backend server and database are hosted on an AWS server located in the European Union. Uploaded documents are stored in an AWS storage bucket within the same region.

## **5. Cookies**

LF Chat uses **one essential HTTP-only cookie** for authentication.

No analytics, tracking, or advertising cookies are used.

## **6. Retention**

Because the application uses a shared demo account, **no data is stored permanently**.

- Users can manually delete their chats, projects, and uploaded documents at any time
- **All demo account data is automatically deleted every 24 hours (midnight UTC)** 

There are no permanent user accounts or long-term data storage.

## **7. Legal Basis (GDPR)**

Since LF Chat is a demonstration tool with no personal accounts, the legal bases for processing are:

- **Legitimate interest** (Article 6(1)(f)) — providing a functional demo application
- **User consent** — when users voluntarily input information while testing the demo

## **8. Your Rights**

LF Chat uses a shared demo account and does not identify individual users.

However, users have full control over the content they create during their session.

Within the application, users can:

- **Create** chats, projects, and documents 
- **Edit** their content
- **Delete** chats, projects, messages, and uploaded documents at any time

Deleted content is removed immediately.

Additionally, **all demo account data is automatically erased every 24 hours**, ensuring no information is stored permanently.

Because LF Chat does not maintain personal accounts or track identities, certain GDPR rights that require user verification (such as data portability or formal access reports) may not apply in this environment.

## **9. Data Security**

We implement reasonable technical measures to protect data, including:

- HTTPS encryption
- HTTP-only authentication cookie
- Access controls on the server and database
- Secure storage in AWS S3
- Daily automated deletion of all demo data
- Moderation of user inputs through the OpenAI Moderation API

These measures are appropriate for a publicly accessible demonstration tool, but users should not enter personal or sensitive data.

## **10. Changes to This Policy**

We may update this Privacy Policy occasionally.

The latest version will always be available on the LF Chat web app.`}
      />
    </Box>
  );
}
