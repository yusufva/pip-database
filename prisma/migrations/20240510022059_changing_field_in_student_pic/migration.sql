/*
  Warnings:

  - You are about to drop the column `pic` on the `student` table. All the data in the column will be lost.
  - Added the required column `aspirator` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `koordinator` to the `student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student` DROP COLUMN `pic`,
    ADD COLUMN `aspirator` VARCHAR(191) NOT NULL,
    ADD COLUMN `koordinator` VARCHAR(191) NOT NULL,
    MODIFY `nik` VARCHAR(17) NULL;
