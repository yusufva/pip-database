/*
  Warnings:

  - The primary key for the `familymember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `nokk` on the `familymember` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(17)`.
  - You are about to alter the column `status` on the `familystatus` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(5)`.
  - You are about to drop the column `familyId` on the `student` table. All the data in the column will be lost.
  - Added the required column `id` to the `familyMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `familymember` DROP FOREIGN KEY `familyMember_nokk_fkey`;

-- DropForeignKey
ALTER TABLE `familymember` DROP FOREIGN KEY `familyMember_statusId_fkey`;

-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `student_familyId_fkey`;

-- AlterTable
ALTER TABLE `familymember` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `nik` VARCHAR(17) NOT NULL,
    MODIFY `nokk` VARCHAR(17) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `familystatus` MODIFY `status` VARCHAR(5) NOT NULL;

-- AlterTable
ALTER TABLE `student` DROP COLUMN `familyId`,
    ADD COLUMN `nokk` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `student_nokk_fkey` FOREIGN KEY (`nokk`) REFERENCES `family`(`nokk`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `familyMember` ADD CONSTRAINT `familyMember_nokk_fkey` FOREIGN KEY (`nokk`) REFERENCES `family`(`nokk`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `familyMember` ADD CONSTRAINT `familyMember_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `familyStatus`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
