/*
  Warnings:

  - You are about to drop the column `aspirator` on the `user` table. All the data in the column will be lost.
  - Added the required column `aspiratorId` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `aspirator`,
    ADD COLUMN `aspiratorId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_aspiratorId_fkey` FOREIGN KEY (`aspiratorId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
