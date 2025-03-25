// // @ts-ignore
// import { faker } from "@faker-js/faker";
// import bcrypt from "bcrypt";
// import { AppDataSource } from "../../ormconfig";
// import { User, Deck, Folder, Flashcard, Role, Class } from "../entities";
// import dotenv from "dotenv";

// dotenv.config();

// const TOTAL_RECORDS = 10000;
// const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "10");

// async function seedDatabase() {
//     console.log("Starting database seeding...");
//     try {
//         await AppDataSource.initialize();
//         console.log("Database connection established");

//         console.log("Seeding roles...");
//         await seedRoles();

//         console.log("Seeding users...");
//         const users = await seedUsers();

//         console.log("Seeding classes...");
//         const classes = await seedClasses(users);

//         console.log("Seeding folders...");
//         const folders = await seedFolders(users);

//         console.log("Seeding decks...");
//         const decks = await seedDecks(users);

//         console.log("Seeding flashcards...");
//         await seedFlashcards(decks);

//         console.log("Seeding relationships...");
//         await seedUserClasses(users, classes);
//         await seedClassFolders(classes, folders);
//         await seedClassDecks(classes, decks);
//         await seedDeckFolders(decks, folders);
//         await seedUserRoles(users);

//         console.log("Database seeding completed successfully!");
//         process.exit(0);
//     } catch (error) {
//         console.error("Error seeding database:", error);
//         process.exit(1);
//     }
// }

// async function seedRoles(): Promise<Role[]> {
//     const roleRepository = AppDataSource.getRepository(Role);
//     await roleRepository.clear();
//     const roles = ["student", "teacher", "admin"];

//     for (let i = 0; i < 3; i++) {
//         await roleRepository.save({
//             name: roles[i],
//         });
//     }

//     return await roleRepository.find();
// }

// async function seedUsers() {
//     const userRepository = AppDataSource.getRepository(User);

//     // Clear existing users
//     await userRepository.clear();

//     const users = [];

//     // Create users in batches to avoid memory issues
//     const batchSize = 500;
//     const batches = Math.ceil(TOTAL_RECORDS / batchSize);

//     for (let b = 0; b < batches; b++) {
//         const userBatch = [];
//         const currentBatchSize = Math.min(batchSize, TOTAL_RECORDS - b * batchSize);

//         for (let i = 0; i < currentBatchSize; i++) {
//             const hashedPassword = await bcrypt.hash("password123", SALT_ROUNDS);
//             userBatch.push({
//                 email: faker.internet.email(),
//                 password: hashedPassword,
//                 username: faker.internet.userName(),
//                 dob: faker.date.past(),
//                 avatar_url: faker.image.avatar(),
//             });
//         }

//         const savedUsers = await userRepository.save(userBatch);
//         users.push(...savedUsers);
//         console.log(`Seeded batch ${b + 1}/${batches} of users`);
//     }

//     return users;
// }

// async function seedClasses(users: User[]) {
//     const classRepository = AppDataSource.getRepository(Class);

//     // Clear existing classes
//     await classRepository.clear();

//     const classes = [];

//     // Create classes in batches
//     const batchSize = 500;
//     const batches = Math.ceil(TOTAL_RECORDS / batchSize);

//     for (let b = 0; b < batches; b++) {
//         const classBatch = [];
//         const currentBatchSize = Math.min(batchSize, TOTAL_RECORDS - b * batchSize);

//         for (let i = 0; i < currentBatchSize; i++) {
//             const randomUser = users[Math.floor(Math.random() * users.length)];
//             classBatch.push({
//                 name: faker.word.adjective() + " " + faker.word.noun() + " Class",
//                 author: randomUser,
//                 studentQuantity: faker.number.int({ min: 5, max: 100 }),
//             });
//         }

//         const savedClasses = await classRepository.save(classBatch);
//         classes.push(...savedClasses);
//         console.log(`Seeded batch ${b + 1}/${batches} of classes`);
//     }

//     return classes;
// }

// async function seedFolders(users: User[]) {
//     const folderRepository = AppDataSource.getRepository(Folder);

//     // Clear existing folders
//     await folderRepository.clear();

//     const folders = [];

//     // Create folders in batches
//     const batchSize = 500;
//     const batches = Math.ceil(TOTAL_RECORDS / batchSize);

//     for (let b = 0; b < batches; b++) {
//         const folderBatch = [];
//         const currentBatchSize = Math.min(batchSize, TOTAL_RECORDS - b * batchSize);

//         for (let i = 0; i < currentBatchSize; i++) {
//             const randomUser = users[Math.floor(Math.random() * users.length)];
//             folderBatch.push({
//                 name: faker.system.fileName().split(".")[0],
//                 author: randomUser,
//                 visibility: Math.random() > 0.5 ? "public" : "private",
//             });
//         }

//         const savedFolders = await folderRepository.save(folderBatch);
//         folders.push(...savedFolders);
//         console.log(`Seeded batch ${b + 1}/${batches} of folders`);
//     }

//     return folders;
// }

// async function seedDecks(users: User[]) {
//     const deckRepository = AppDataSource.getRepository(Deck);

//     // Clear existing decks
//     await deckRepository.clear();

//     const decks = [];

//     // Create decks in batches
//     const batchSize = 500;
//     const batches = Math.ceil(TOTAL_RECORDS / batchSize);

//     for (let b = 0; b < batches; b++) {
//         const deckBatch = [];
//         const currentBatchSize = Math.min(batchSize, TOTAL_RECORDS - b * batchSize);

//         for (let i = 0; i < currentBatchSize; i++) {
//             const randomUser = users[Math.floor(Math.random() * users.length)];
//             deckBatch.push({
//                 name: faker.commerce.productName() + " Deck",
//                 description: faker.lorem.paragraph(),
//                 author: randomUser,
//                 visibility: Math.random() > 0.5 ? "public" : "private",
//             });
//         }

//         const savedDecks = await deckRepository.save(deckBatch);
//         decks.push(...savedDecks);
//         console.log(`Seeded batch ${b + 1}/${batches} of decks`);
//     }

//     return decks;
// }

// async function seedFlashcards(decks: Deck[]) {
//     const flashcardRepository = AppDataSource.getRepository(Flashcard);

//     // Clear existing flashcards
//     await flashcardRepository.clear();

//     // Create flashcards in batches
//     const batchSize = 500;
//     const batches = Math.ceil(TOTAL_RECORDS / batchSize);

//     for (let b = 0; b < batches; b++) {
//         const flashcardBatch = [];
//         const currentBatchSize = Math.min(batchSize, TOTAL_RECORDS - b * batchSize);

//         for (let i = 0; i < currentBatchSize; i++) {
//             const randomDeck = decks[Math.floor(Math.random() * decks.length)];
//             flashcardBatch.push({
//                 frontText: faker.lorem.sentence(),
//                 backText: faker.lorem.paragraph(),
//                 imageUrl: Math.random() > 0.7 ? faker.image.url() : null,
//                 audioUrl: Math.random() > 0.8 ? "https://example.com/audio/" + faker.string.uuid() + ".mp3" : null,
//                 description: Math.random() > 0.5 ? faker.lorem.sentence() : null,
//                 deck: randomDeck,
//             });
//         }

//         await flashcardRepository.save(flashcardBatch);
//         console.log(`Seeded batch ${b + 1}/${batches} of flashcards`);
//     }
// }

// async function seedUserClasses(users: User[], classes: Class[]) {
//     await AppDataSource.query("TRUNCATE TABLE user_classes");

//     const batchSize = 1000;
//     const batches = Math.ceil(TOTAL_RECORDS / batchSize);

//     for (let b = 0; b < batches; b++) {
//         const values = [];
//         const currentBatchSize = Math.min(batchSize, TOTAL_RECORDS - b * batchSize);

//         for (let i = 0; i < currentBatchSize; i++) {
//             const randomUser = users[Math.floor(Math.random() * users.length)];
//             const randomClass = classes[Math.floor(Math.random() * classes.length)];
//             values.push(`('${randomUser.id}', '${randomClass.id}')`);
//         }

//         await AppDataSource.query(`
//       INSERT INTO user_classes (user_id, class_id)
//       VALUES ${values.join(",")}
//     `);

//         console.log(`Seeded batch ${b + 1}/${batches} of user_classes`);
//     }
// }

// async function seedClassFolders(classes: Class[], folders: Folder[]) {
//     await AppDataSource.query("TRUNCATE TABLE class_folders");

//     const batchSize = 1000;
//     const batches = Math.ceil(TOTAL_RECORDS / batchSize);

//     for (let b = 0; b < batches; b++) {
//         const values = [];
//         const currentBatchSize = Math.min(batchSize, TOTAL_RECORDS - b * batchSize);

//         for (let i = 0; i < currentBatchSize; i++) {
//             const randomClass = classes[Math.floor(Math.random() * classes.length)];
//             const randomFolder = folders[Math.floor(Math.random() * folders.length)];
//             values.push(`('${randomClass.id}', '${randomFolder.id}')`);
//         }

//         await AppDataSource.query(`
//       INSERT INTO class_folders (class_id, folder_id)
//       VALUES ${values.join(",")}
//     `);

//         console.log(`Seeded batch ${b + 1}/${batches} of class_folders`);
//     }
// }

// async function seedClassDecks(classes: Class[], decks: Deck[]) {
//     await AppDataSource.query("TRUNCATE TABLE class_decks");

//     const batchSize = 1000;
//     const batches = Math.ceil(TOTAL_RECORDS / batchSize);

//     for (let b = 0; b < batches; b++) {
//         const values = [];
//         const currentBatchSize = Math.min(batchSize, TOTAL_RECORDS - b * batchSize);

//         for (let i = 0; i < currentBatchSize; i++) {
//             const randomClass = classes[Math.floor(Math.random() * classes.length)];
//             const randomDeck = decks[Math.floor(Math.random() * decks.length)];
//             values.push(`('${randomClass.id}', '${randomDeck.id}')`);
//         }

//         await AppDataSource.query(`
//       INSERT INTO class_decks (class_id, deck_id)
//       VALUES ${values.join(",")}
//     `);

//         console.log(`Seeded batch ${b + 1}/${batches} of class_decks`);
//     }
// }

// async function seedDeckFolders(decks: Deck[], folders: Folder[]) {
//     await AppDataSource.query("TRUNCATE TABLE deck_folders");

//     const batchSize = 1000;
//     const batches = Math.ceil(TOTAL_RECORDS / batchSize);

//     for (let b = 0; b < batches; b++) {
//         const values = [];
//         const currentBatchSize = Math.min(batchSize, TOTAL_RECORDS - b * batchSize);

//         for (let i = 0; i < currentBatchSize; i++) {
//             const randomDeck = decks[Math.floor(Math.random() * decks.length)];
//             const randomFolder = folders[Math.floor(Math.random() * folders.length)];
//             values.push(`('${randomDeck.id}', '${randomFolder.id}')`);
//         }

//         await AppDataSource.query(`
//       INSERT INTO deck_folders (deck_id, folder_id)
//       VALUES ${values.join(",")}
//     `);

//         console.log(`Seeded batch ${b + 1}/${batches} of deck_folders`);
//     }
// }

// async function seedUserRoles(users: User[]) {
//     await AppDataSource.query("TRUNCATE TABLE user_roles");

//     const batchSize = 1000;
//     const batches = Math.ceil(TOTAL_RECORDS / batchSize);
//     const roleIds = [1, 2, 3]; // Assuming you have at least 3 roles (student, teacher, admin)

//     for (let b = 0; b < batches; b++) {
//         const values = [];
//         const currentBatchSize = Math.min(batchSize, TOTAL_RECORDS - b * batchSize);

//         for (let i = 0; i < currentBatchSize; i++) {
//             const randomUser = users[Math.floor(Math.random() * users.length)];
//             const randomRoleId = roleIds[Math.floor(Math.random() * roleIds.length)];
//             values.push(`('${randomUser.id}', ${randomRoleId})`);
//         }

//         await AppDataSource.query(`
//       INSERT INTO user_roles (user_id, role_id)
//       VALUES ${values.join(",")}
//     `);

//         console.log(`Seeded batch ${b + 1}/${batches} of user_roles`);
//     }
// }

// // Run the seeder
// seedDatabase();
