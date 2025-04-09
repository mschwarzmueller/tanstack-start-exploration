PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_topics` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP),
	`updatedAt` text,
	`createdBy` text,
	FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_topics`("id", "title", "description", "createdAt", "updatedAt", "createdBy") SELECT "id", "title", "description", "createdAt", "updatedAt", "createdBy" FROM `topics`;--> statement-breakpoint
DROP TABLE `topics`;--> statement-breakpoint
ALTER TABLE `__new_topics` RENAME TO `topics`;--> statement-breakpoint
PRAGMA foreign_keys=ON;