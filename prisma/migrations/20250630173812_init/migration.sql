-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STAFF', 'VIEWER');

-- CreateEnum
CREATE TYPE "WarehouseLocationType" AS ENUM ('KHO', 'KE', 'NGAN');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "phone_number" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "unit" TEXT NOT NULL,
    "barcode" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "locationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouselocation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "type" "WarehouseLocationType" NOT NULL,
    "parentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "warehouselocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inboundreceipt" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,

    CONSTRAINT "inboundreceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inbounddetail" (
    "id" SERIAL NOT NULL,
    "receiptId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "locationId" INTEGER NOT NULL,

    CONSTRAINT "inbounddetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outboundreceipt" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,

    CONSTRAINT "outboundreceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outbounddetail" (
    "id" SERIAL NOT NULL,
    "receiptId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "locationId" INTEGER NOT NULL,

    CONSTRAINT "outbounddetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stocktaking" (
    "id" SERIAL NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,

    CONSTRAINT "stocktaking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stocktakingdetail" (
    "id" SERIAL NOT NULL,
    "stocktakingId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "actualQuantity" INTEGER NOT NULL,
    "systemQuantity" INTEGER NOT NULL,
    "difference" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,

    CONSTRAINT "stocktakingdetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactionlog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "targetId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactionlog_pkey" PRIMARY KEY ("id")

);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "product_code_key" ON "product"("code");

-- CreateIndex
CREATE UNIQUE INDEX "warehouselocation_code_key" ON "warehouselocation"("code");

-- CreateIndex
CREATE UNIQUE INDEX "inboundreceipt_code_key" ON "inboundreceipt"("code");

-- CreateIndex
CREATE UNIQUE INDEX "outboundreceipt_code_key" ON "outboundreceipt"("code");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "warehouselocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouselocation" ADD CONSTRAINT "warehouselocation_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "warehouselocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inboundreceipt" ADD CONSTRAINT "inboundreceipt_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inbounddetail" ADD CONSTRAINT "inbounddetail_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "inboundreceipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inbounddetail" ADD CONSTRAINT "inbounddetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inbounddetail" ADD CONSTRAINT "inbounddetail_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "warehouselocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outboundreceipt" ADD CONSTRAINT "outboundreceipt_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outbounddetail" ADD CONSTRAINT "outbounddetail_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "outboundreceipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outbounddetail" ADD CONSTRAINT "outbounddetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outbounddetail" ADD CONSTRAINT "outbounddetail_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "warehouselocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktaking" ADD CONSTRAINT "stocktaking_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktakingdetail" ADD CONSTRAINT "stocktakingdetail_stocktakingId_fkey" FOREIGN KEY ("stocktakingId") REFERENCES "stocktaking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktakingdetail" ADD CONSTRAINT "stocktakingdetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocktakingdetail" ADD CONSTRAINT "stocktakingdetail_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "warehouselocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactionlog" ADD CONSTRAINT "transactionlog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
