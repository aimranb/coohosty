CREATE TYPE "Plan" AS ENUM ('AUDIT', 'OPTIMIZE', 'COHOST', 'UNDECIDED');
CREATE TYPE "RequestStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'AUDIT_SENT');
CREATE TABLE "User" (
  "id" TEXT NOT NULL, "email" TEXT NOT NULL, "passwordHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Session" (
  "id" TEXT NOT NULL, "tokenHash" TEXT NOT NULL, "userId" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "AuditRequest" (
  "id" TEXT NOT NULL, "submissionKey" TEXT NOT NULL, "payloadHash" TEXT NOT NULL,
  "fullName" TEXT NOT NULL, "phone" TEXT NOT NULL, "email" TEXT NOT NULL,
  "country" TEXT NOT NULL, "plan" "Plan" NOT NULL,
  "status" "RequestStatus" NOT NULL DEFAULT 'NEW', "locale" TEXT NOT NULL,
  "source" TEXT NOT NULL DEFAULT 'website', "authorization" TEXT NOT NULL,
  "objective" TEXT NOT NULL, "availability" TEXT NOT NULL, "comments" TEXT,
  "consent" BOOLEAN NOT NULL, "consentVersion" TEXT NOT NULL DEFAULT '2026-10',
  "consentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AuditRequest_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "AuditRequest_consent_check" CHECK ("consent" = TRUE)
);
CREATE TABLE "Property" (
  "id" TEXT NOT NULL, "requestId" TEXT NOT NULL, "city" TEXT NOT NULL,
  "neighborhood" TEXT NOT NULL, "type" TEXT NOT NULL, "surface" DOUBLE PRECISION NOT NULL,
  "bedrooms" INTEGER NOT NULL, "beds" INTEGER NOT NULL, "bathrooms" INTEGER NOT NULL,
  "capacity" INTEGER NOT NULL, "amenities" TEXT[] NOT NULL, "finish" TEXT NOT NULL,
  "isRental" BOOLEAN NOT NULL, "listingUrl" TEXT, "platforms" TEXT[] NOT NULL,
  "nightlyRate" DOUBLE PRECISION, "occupancy" DOUBLE PRECISION, "rating" DOUBLE PRECISION,
  "management" TEXT, "propertyStatus" TEXT,
  CONSTRAINT "Property_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Property_surface_check" CHECK ("surface" > 0),
  CONSTRAINT "Property_capacity_check" CHECK ("capacity" > 0),
  CONSTRAINT "Property_occupancy_check" CHECK ("occupancy" IS NULL OR "occupancy" BETWEEN 0 AND 100)
);
CREATE TABLE "UploadedPhoto" (
  "id" TEXT NOT NULL, "propertyId" TEXT NOT NULL, "url" TEXT NOT NULL,
  "publicId" TEXT NOT NULL, "mimeType" TEXT NOT NULL, "size" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UploadedPhoto_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ActivityLog" (
  "id" TEXT NOT NULL, "requestId" TEXT NOT NULL, "userId" TEXT NOT NULL,
  "action" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "RateLimit" (
  "key" TEXT NOT NULL, "count" INTEGER NOT NULL DEFAULT 1, "expiresAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("key")
);
CREATE TABLE "EmailOutbox" (
  "id" TEXT NOT NULL, "requestId" TEXT NOT NULL, "kind" TEXT NOT NULL,
  "sentAt" TIMESTAMP(3), "attempts" INTEGER NOT NULL DEFAULT 0,
  "lockedUntil" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EmailOutbox_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");
CREATE UNIQUE INDEX "AuditRequest_submissionKey_key" ON "AuditRequest"("submissionKey");
CREATE INDEX "AuditRequest_plan_idx" ON "AuditRequest"("plan");
CREATE INDEX "AuditRequest_status_idx" ON "AuditRequest"("status");
CREATE INDEX "AuditRequest_createdAt_idx" ON "AuditRequest"("createdAt");
CREATE INDEX "AuditRequest_email_idx" ON "AuditRequest"("email");
CREATE UNIQUE INDEX "Property_requestId_key" ON "Property"("requestId");
CREATE INDEX "Property_city_idx" ON "Property"("city");
CREATE UNIQUE INDEX "UploadedPhoto_publicId_key" ON "UploadedPhoto"("publicId");
CREATE INDEX "ActivityLog_requestId_createdAt_idx" ON "ActivityLog"("requestId", "createdAt");
CREATE INDEX "RateLimit_expiresAt_idx" ON "RateLimit"("expiresAt");
CREATE UNIQUE INDEX "EmailOutbox_requestId_kind_key" ON "EmailOutbox"("requestId", "kind");
CREATE INDEX "EmailOutbox_sentAt_lockedUntil_idx" ON "EmailOutbox"("sentAt", "lockedUntil");
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Property" ADD CONSTRAINT "Property_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "AuditRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UploadedPhoto" ADD CONSTRAINT "UploadedPhoto_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "AuditRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EmailOutbox" ADD CONSTRAINT "EmailOutbox_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "AuditRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
