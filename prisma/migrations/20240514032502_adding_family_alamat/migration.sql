-- AlterTable
ALTER TABLE `familymember` ADD COLUMN `alamat` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `kecamatan` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `kota` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `provinsi` VARCHAR(191) NOT NULL DEFAULT '';
