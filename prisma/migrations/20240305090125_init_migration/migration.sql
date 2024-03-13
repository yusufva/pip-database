-- CreateTable
CREATE TABLE `student` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nisn` VARCHAR(11) NOT NULL,
    `fase` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `sekolah` VARCHAR(191) NOT NULL,
    `provinsiSekolah` VARCHAR(191) NOT NULL,
    `kotaSekolah` VARCHAR(191) NOT NULL,
    `kecamatanSekolah` VARCHAR(191) NOT NULL,
    `nik` VARCHAR(17) NOT NULL,
    `npsn` VARCHAR(9) NULL,
    `kelas` INTEGER NOT NULL,
    `rombel` VARCHAR(191) NOT NULL,
    `semester` VARCHAR(191) NOT NULL,
    `jenjang` VARCHAR(5) NOT NULL,
    `bentuk` VARCHAR(191) NOT NULL,
    `kelamin` VARCHAR(1) NOT NULL,
    `tempatLahir` VARCHAR(191) NOT NULL,
    `tanggalLahir` DATETIME(3) NOT NULL,
    `familyId` VARCHAR(191) NULL,
    `nominal` INTEGER NULL,
    `tipeSk` VARCHAR(191) NULL,
    `skNominasi` VARCHAR(191) NULL,
    `tanggalSkNominasi` DATETIME(3) NULL,
    `tahapNominasi` INTEGER NULL,
    `vaNominasi` VARCHAR(191) NULL,
    `noRek` VARCHAR(191) NULL,
    `bank` VARCHAR(10) NULL,
    `layakPip` BOOLEAN NULL,
    `keteranganTahap` VARCHAR(191) NULL,
    `keteranganPencairan` VARCHAR(191) NULL,
    `keteranganTambahan` VARCHAR(191) NULL,
    `status` VARCHAR(2) NULL,
    `pic` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `student_id_key`(`id`),
    PRIMARY KEY (`nisn`, `fase`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `family` (
    `nik` VARCHAR(17) NOT NULL,
    `anakKe` INTEGER NULL,
    `kotaLahir` VARCHAR(191) NOT NULL,
    `ttl` DATETIME(3) NOT NULL,

    PRIMARY KEY (`nik`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `familyMember` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `nik` VARCHAR(191) NOT NULL,
    `statusId` INTEGER NOT NULL,
    `anakKe` INTEGER NULL,
    `kotaLahir` VARCHAR(191) NOT NULL,
    `ttl` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `familyStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `student_familyId_fkey` FOREIGN KEY (`familyId`) REFERENCES `family`(`nik`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `familyMember` ADD CONSTRAINT `familyMember_nik_fkey` FOREIGN KEY (`nik`) REFERENCES `family`(`nik`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `familyMember` ADD CONSTRAINT `familyMember_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `familyStatus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
