import { Box } from "@mui/material";
import { Link } from "../components/ui/link";
import { MarkdownRenderer } from "../components/ui/markdown-renderer";
import { Text } from "../components/ui/text";

export function TermsOfUse() {
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
        Terms of Use
      </Text>
      <MarkdownRenderer
        content={`**Last updated:** November 30, 2025
          
Welcome to **LF Chat**, a personal portfolio project created by **Lucas Fontana** (“we”, “us”, “our”).

By accessing or using LF Chat, you agree to these Terms of Use.

If you do not agree, please do not use the application.

LF Chat is a **demonstration tool only**, not a commercial service.

For questions about these Terms, you may contact: lucasfontanasv@gmail.com

## **1. Demo Purpose Only**

LF Chat is a public demo showcasing AI chat and RAG features.

It is not intended for:

- professional use
- processing real personal data 
- storing confidential or sensitive information 
- providing factual, legal, or professional advice  

The application may change, be unavailable, or be deleted at any time.

## **2. No Personal or Sensitive Data**

Users **must not** input or upload:

- personal data about yourself or others
- sensitive data (health, biometrics, political opinions, etc.)
- private or confidential documents
- proprietary business information 

Any data you enter into the demo account may be visible to others who use the demo.

You are fully responsible for the content you enter or upload.

## **3. User Responsibilities**

By using LF Chat, you agree to:

- use the application legally and ethically
- not misuse or abuse the service
- not attempt to reverse engineer, exploit, or attack the system
- not upload harmful, unlawful, or abusive content
- not attempt to impersonate others or enter their personal data 

If you violate these terms, your access may be blocked.

## **4. AI-Generated Content**

LF Chat uses the **OpenAI API** to generate responses.

AI-generated content may be:

- inaccurate 
- incomplete  
- outdated 
- biased 
- inappropriate 

You should not rely on AI-generated outputs for real-world decisions.

We are not responsible for any harm that results from using or relying on AI-generated content.

## **5. Data Storage and Deletion**

LF Chat uses a **shared demo account**. 

All data (chats, projects, documents) can be created, edited, and deleted directly by users.

Additionally:

- **all demo account data is automatically deleted every 24 hours**
- no permanent accounts exist  
- no data is stored long-term  
- we do not identify individual users  

For more information, see our Privacy Policy.

## **6. Acceptable Use Restrictions**

You agree **not** to use LF Chat to:

- violate any law or regulation 
- engage in harassment or hate speech 
- generate harmful or malicious content 
- upload malware or harmful files 
- attempt to overload or disrupt the system 
- bypass security protections 
- scrape or automate access to the app 
- perform security scanning or penetration testing 

We may rate-limit or block IPs that abuse the service.

## **7. Service Availability**

LF Chat is provided **as-is**, without:

- uptime guarantees 
- reliability commitments 
- error-free operation 
- continuous availability 

Features may change or be removed without notice. 

The service may stop functioning at any time.

## **8. Limitation of Liability**

To the fullest extent allowed by law:

- we provide LF Chat *as-is* and *as available* 
- we disclaim all warranties (express or implied) 
- we are not liable for damages or losses resulting from use of the app, including:
  - incorrect AI outputs  
  - security incidents
  - data loss
  - downtime
  - misuse by other users
  - uploaded content

LF Chat is a personal demo and should not be relied upon for professional or critical use.

## **9. Intellectual Property**

The **source code** for LF Chat is publicly available on GitHub and is licensed under the MIT License. 

This open-source license applies only to the project’s codebase and governs how others may use, copy, modify, and distribute the source code.

The hosted demo application made available at runtime (including the user interface and deployed environment) is provided separately under these Terms of Use. 

Use of the hosted demo does not grant any rights beyond what is permitted by the MIT License for the source code.

The name “LF Chat” is simply the name of this personal project and is not a registered trademark. No trademark or brand rights are asserted or transferred through these Terms.

Users retain all rights to the content they input into the application (such as messages, projects, and uploaded documents).

By using the demo, you grant us a temporary license to process your content solely for the purpose of operating the application.

## **10. Changes to These Terms**

We may update these Terms of Use occasionally.  

The latest version will always be available on the LF Chat web app.`}
      />
    </Box>
  );
}
