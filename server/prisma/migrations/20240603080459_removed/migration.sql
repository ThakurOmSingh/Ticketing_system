/*
  Warnings:

  - You are about to drop the column `userRegistered` on the `Query` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Correspondence_adminId_fkey` ON `Correspondence`;

-- DropIndex
DROP INDEX `Query_assignedTo_fkey` ON `Query`;

-- DropIndex
DROP INDEX `Query_userid_fkey` ON `Query`;

-- AlterTable
ALTER TABLE `Query` DROP COLUMN `userRegistered`;
