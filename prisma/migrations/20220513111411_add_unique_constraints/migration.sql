/*
  Warnings:

  - You are about to drop the column `testerId` on the `Task` table. All the data in the column will be lost.
  - The values [Backlog,Prioritized,Resolved,Deployed,InTest,OnReview,Released] on the enum `Task_status` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[projectId,name]` on the table `Feature` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[accountId,name]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dueDate` to the `Feature` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Feature` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentUrl` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Task` DROP FOREIGN KEY `Task_testerId_fkey`;

-- AlterTable
ALTER TABLE `Account` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `usersCount` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `Comment` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Feature` ADD COLUMN `dueDate` DATETIME(3) NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Project` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Release` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Task` DROP COLUMN `testerId`,
    ADD COLUMN `contentUrl` VARCHAR(191) NOT NULL,
    MODIFY `status` ENUM('Todo', 'InProgress', 'Done') NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX `Feature_projectId_name_key` ON `Feature`(`projectId`, `name`);

-- CreateIndex
CREATE UNIQUE INDEX `Project_accountId_name_key` ON `Project`(`accountId`, `name`);
