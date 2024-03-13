/*
  Warnings:

  - The primary key for the `family` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `anakKe` on the `family` table. All the data in the column will be lost.
  - You are about to drop the column `kotaLahir` on the `family` table. All the data in the column will be lost.
  - You are about to drop the column `nik` on the `family` table. All the data in the column will be lost.
  - You are about to drop the column `ttl` on the `family` table. All the data in the column will be lost.
  - The primary key for the `familymember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `familymember` table. All the data in the column will be lost.
  - You are about to alter the column `nik` on the `familymember` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Added the required column `nokk` to the `family` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nokk` to the `familyMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `familymember` DROP FOREIGN KEY `familyMember_nik_fkey`;

-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `student_familyId_fkey`;

-- AlterTable
ALTER TABLE `family` DROP PRIMARY KEY,
    DROP COLUMN `anakKe`,
    DROP COLUMN `kotaLahir`,
    DROP COLUMN `nik`,
    DROP COLUMN `ttl`,
    ADD COLUMN `nokk` VARCHAR(17) NOT NULL,
    ADD PRIMARY KEY (`nokk`);

-- AlterTable
ALTER TABLE `familymember` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `nokk` VARCHAR(191) NOT NULL,
    MODIFY `nik` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`nik`);

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `student_familyId_fkey` FOREIGN KEY (`familyId`) REFERENCES `family`(`nokk`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `familyMember` ADD CONSTRAINT `familyMember_nokk_fkey` FOREIGN KEY (`nokk`) REFERENCES `family`(`nokk`) ON DELETE RESTRICT ON UPDATE CASCADE;
