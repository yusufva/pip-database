-- AlterTable
ALTER TABLE `familymember` MODIFY `ttl` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `student` MODIFY `semester` VARCHAR(191) NOT NULL DEFAULT '';
