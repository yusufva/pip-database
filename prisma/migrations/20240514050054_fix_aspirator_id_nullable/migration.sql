-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_aspiratorId_fkey`;

-- AlterTable
ALTER TABLE `user` MODIFY `aspiratorId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_aspiratorId_fkey` FOREIGN KEY (`aspiratorId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
