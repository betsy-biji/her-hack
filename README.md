<img width="1280" height="640" alt="img" src="https://github.com/user-attachments/assets/edf91eed-58d6-413f-81f2-7a7d368870d7" />

PARCELGUARD🎯

Basic Details

Team Name: Sparkle

Team Members

Member 1: Adhithya K - Muthoot Institute of Technology and Science

Member 2: Betsy Biji - Muthoot Institute of Technology and Science
Hosted Project Link
https://her-hack.vercel.app/

Project Description
ParcelGuard is a secure parcel verification system designed for college hostels where parcel theft and mix-ups are common.
It ensures that only the rightful owner can collect a parcel using a two-step verification process involving OTP and Order ID scanning at the security desk.

The Problem statement
In many college hostels, parcels are left at a common security/front desk.
Due to lack of verification, parcels often get misplaced or taken by someone else, leading to loss, confusion, and disputes among students.

The Solution
ParcelGuard solves this by introducing a two-step verification system:
Order Registration – Students register their parcel details (Order ID).
Secure Retrieval –
An OTP is generated when the student comes to collect the parcel
The security desk verifies:
OTP entered by the student
Order ID scanned from the parcel
The parcel is handed over only if both OTP and Order ID match
This ensures only the rightful owner can retrieve the parcel.

Technical Details
Technologies/Components Used
For Software:

Languages used: JavaScript,TypeScript
Frameworks used: Next.js,Node.js
Libraries used: Axios,Zod,JWT,QR Code,Barcode Scanner Library (e.g., html5-qrcode)
Tools used: VS Code,Git & GitHub,Vercel (Deployment),Antigravity (UI/Design tool)

Implementation
For Software:
Installation
git clone https://github.com/your-username/parcelguard.git,cd her-hack,npm install
Run
npm run dev


Project Documentation
For Software:
Screenshots 
LOGGED IN PERSONAL DASHBOARD
<img width="992" height="832" alt="Screenshot 2026-02-21 072255" src="https://github.com/user-attachments/assets/da2f6d95-0023-4077-b46a-4f6a45aab0c9" />

DETAILS FORM OF EXPECTED PACKAGE WHICH WILL ARRIVE
<img width="769" height="627" alt="Screenshot 2026-02-21 084816" src="https://github.com/user-attachments/assets/ba909898-b9ec-46ec-bf2f-88cd098579a6" />

DETAILS OF OTP GENERATION PHASE FOR VERIFICATION
<img width="678" height="573" alt="Screenshot 2026-02-21 084756" src="https://github.com/user-attachments/assets/a7dd0bc0-b22a-4fb2-8f66-da0a55424722" />



Diagrams
System Architecture:
The architecture follows a Client-Server-Database model, optimized for real-time verification at the security desk.

1. Components & Tech Stack
Frontend (Next.js & TypeScript): Handles the Student Dashboard (registering parcels) and the Security Desk Interface (scanning and verifying).
Backend (Node.js/Next.js API Routes): Processes the logic for OTP generation, barcode validation, and JWT-based authentication.
Database (PostgreSQL/MongoDB): Stores student profiles, parcel "Expected" records, and "Received" logs.
Verification Engine: * Barcode Scanner (html5-qrcode): Captures the Order ID from the physical parcel.
OTP Logic: Validates the temporary code provided by the student.

Architecture Diagram Explain your system architecture - components, data flow, tech stack interaction

<img width="1024" height="1024" alt="Gemini_Generated_Image_a7bycja7bycja7by" src="https://github.com/user-attachments/assets/4930c655-8845-41c4-a881-80062b1fa666" />

componets 
Student Web App: Allows students to register parcel Order IDs and request OTP for secure parcel collection.
Security Desk Dashboard: Used by security staff to enter OTP and scan parcel Order IDs for verification.
Backend Server: Handles OTP generation, order verification logic, and communication between frontend and database.
Database: Stores registered Order IDs, generated OTPs, and parcel verification records.
Parcel Scanner (Camera): Scans the Order ID printed on the parcel and sends it for verification.

data flow
Parcel details are registered by the student, an OTP is generated during retrieval, the parcel Order ID is scanned, and both are verified by the backend before allowing collection.

tech stack interaction
The Next.js frontend communicates with Node.js backend APIs, which validate data using the database and scanner input to securely verify parcel ownership.


Application Workflow:
Student places an order online
Student registers the Order ID in ParcelGuard
Parcel arrives at college security desk
Student visits security desk to collect parcel
System generates a one-time OTP
Security dashboard:
OTP is entered
Parcel Order ID is scanned
System matches:
Registered Order ID
Scanned Order ID
OTP
If verified ✅ → Parcel is handed over





Additional Documentation
For Web Projects with Backend:
API Documentation
Base URL: https://api.her-hack.com


Endpoints
GET /api/endpoint
POST /api/register-order

Description: 
Parameters:Registers a parcel Order ID for a student

response
{
  "status": "success",
  "message": "Order registered successfully"
}
POST /api/endpoint

POST /api/verify-parcel
Description: Verifies OTP and scanned Order ID
Request Body:
{
  
  "orderId": "ORD123456",
  "otp": "482931"

}
Response:
{
  "status": "success",
  "verified": true
}

AI Tools Used (Transparency Bonus)
Tool Used: ChatGPT
Purpose:
Architecture planning
API design
README documentation
Debugging assistance
Percentage of AI-generated code: ~20%

Human Contributions:
System design & logic
UI/UX decisions
API integration
Testing & deployment


team contributions
Betsy Biji: Frontend development, UI design, documentation
Adhithya K: Backend APIs, OTP logic, database handling

License
This project is licensed under the MIT License – see the LICENSE file for details.

Made with ❤️ at TinkerHub
