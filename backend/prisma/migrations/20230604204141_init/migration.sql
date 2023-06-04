-- CreateTable
CREATE TABLE `User` (
    `discordID` VARCHAR(191) NOT NULL,
    `total` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `User_discordID_key`(`discordID`),
    PRIMARY KEY (`discordID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notatka` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `discordID` VARCHAR(191) NOT NULL,
    `notatkaID` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Notatka_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Donate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `discordID` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `approved` BOOLEAN NOT NULL DEFAULT false,
    `approver` VARCHAR(191) NULL,
    `type` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notatka` ADD CONSTRAINT `Notatka_discordID_fkey` FOREIGN KEY (`discordID`) REFERENCES `User`(`discordID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Donate` ADD CONSTRAINT `Donate_discordID_fkey` FOREIGN KEY (`discordID`) REFERENCES `User`(`discordID`) ON DELETE RESTRICT ON UPDATE CASCADE;
