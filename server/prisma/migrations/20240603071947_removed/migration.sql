/*
  Warnings:

  - You are about to drop the `Group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userRegistered` to the `Query` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Correspondence` DROP FOREIGN KEY `Correspondence_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `Query` DROP FOREIGN KEY `Query_assignedTo_fkey`;

-- DropForeignKey
ALTER TABLE `Query` DROP FOREIGN KEY `Query_userid_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_groupId_fkey`;

-- AlterTable
ALTER TABLE `Query` ADD COLUMN `userData` JSON NULL,
    ADD COLUMN `userRegistered` BOOLEAN NOT NULL,
    MODIFY `userid` INTEGER NULL;

-- DropTable
DROP TABLE `Group`;

-- DropTable
DROP TABLE `User`;
