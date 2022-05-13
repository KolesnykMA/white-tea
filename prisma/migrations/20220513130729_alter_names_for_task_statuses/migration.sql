/*
  Warnings:

  - You are about to alter the column `status` on the `Task` table. The data in that column could be lost. The data in that column will be cast from `Enum("Task_status")` to `Enum("Task_status")`.

*/
-- AlterTable
ALTER TABLE `Task` MODIFY `status` ENUM('todo', 'inProgress', 'done') NOT NULL DEFAULT 'todo',
    MODIFY `contentUrl` VARCHAR(191) NULL;
