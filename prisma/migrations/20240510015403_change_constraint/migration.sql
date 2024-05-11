/*
  Warnings:

  - The primary key for the `familymember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `familymember` table. All the data in the column will be lost.
  - You are about to drop the column `nokk` on the `familymember` table. All the data in the column will be lost.
  - You are about to drop the column `nokk` on the `student` table. All the data in the column will be lost.
  - You are about to drop the `family` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `familymember` DROP FOREIGN KEY `familyMember_nokk_fkey`;

-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `student_nokk_fkey`;

-- AlterTable
ALTER TABLE `familymember` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `nokk`,
    ADD PRIMARY KEY (`nik`);

-- AlterTable
ALTER TABLE `student` DROP COLUMN `nokk`;

-- DropTable
DROP TABLE `family`;

-- CreateTable
CREATE TABLE `familyOnStudents` (
    `studentFase` VARCHAR(191) NOT NULL,
    `studentNisn` VARCHAR(11) NOT NULL,
    `familyMemberNik` VARCHAR(17) NOT NULL,

    PRIMARY KEY (`familyMemberNik`, `studentFase`, `studentNisn`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `familyOnStudents` ADD CONSTRAINT `familyOnStudents_studentNisn_studentFase_fkey` FOREIGN KEY (`studentNisn`, `studentFase`) REFERENCES `student`(`nisn`, `fase`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `familyOnStudents` ADD CONSTRAINT `familyOnStudents_familyMemberNik_fkey` FOREIGN KEY (`familyMemberNik`) REFERENCES `familyMember`(`nik`) ON DELETE CASCADE ON UPDATE CASCADE;
