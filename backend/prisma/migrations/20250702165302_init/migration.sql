-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "uname" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "name" TEXT NOT NULL,
    "dateOfExperience" TIMESTAMP(3) NOT NULL,
    "dateOfFeedback" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "beforeImg" TEXT NOT NULL,
    "afterImg" TEXT NOT NULL,
    "overallExp" INTEGER NOT NULL,
    "qualityOfService" INTEGER NOT NULL,
    "timeliness" INTEGER NOT NULL,
    "professionalism" INTEGER NOT NULL,
    "communicationEase" INTEGER NOT NULL,
    "whatLikedMost" TEXT,
    "suggestionImprovement" TEXT,
    "recommendation" TEXT,
    "canPublish" BOOLEAN DEFAULT false,
    "followUp" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_uname_key" ON "user"("uname");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
