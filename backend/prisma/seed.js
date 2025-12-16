"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("Starting seed...");
    // Hash passwords
    const passwordAdmin = await bcrypt_1.default.hash("Admin#1234", 12);
    const passwordUser = await bcrypt_1.default.hash("User#1234", 12);
    // Create admin user
    const admin = await prisma.user.upsert({
        where: { email: "admin@fastfinance.pl" },
        update: {},
        create: {
            email: "admin@fastfinance.pl",
            password: passwordAdmin,
            firstName: "Admin",
            lastName: "FastFinance",
            role: client_1.Role.ADMIN,
        },
    });
    console.log("Created admin:", admin.email);
    // Create demo users
    const jan = await prisma.user.upsert({
        where: { email: "jan.kowalski@demo.pl" },
        update: {},
        create: {
            email: "jan.kowalski@demo.pl",
            password: passwordUser,
            firstName: "Jan",
            lastName: "Kowalski",
            phone: "+48 123 456 789",
        },
    });
    const anna = await prisma.user.upsert({
        where: { email: "anna.nowak@demo.pl" },
        update: {},
        create: {
            email: "anna.nowak@demo.pl",
            password: passwordUser,
            firstName: "Anna",
            lastName: "Nowak",
            phone: "+48 987 654 321",
        },
    });
    console.log("Created users:", jan.email, anna.email);
    // Delete existing loans and payments for clean seed
    await prisma.payment.deleteMany({});
    await prisma.loan.deleteMany({});
    // Create loans
    const janLoan = await prisma.loan.create({
        data: {
            userId: jan.id,
            amount: 50000,
            interestRate: 6.5,
            durationMonths: 60,
            status: "ACTIVE",
            monthlyPayment: 975.5,
            totalAmount: 58530,
        },
    });
    const annaLoan = await prisma.loan.create({
        data: {
            userId: anna.id,
            amount: 25000,
            interestRate: 7.2,
            durationMonths: 36,
            status: "ACTIVE",
            monthlyPayment: 775.8,
            totalAmount: 27928.8,
        },
    });
    console.log("Created loans");
    // Create payments for Jan
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const monthAfter = new Date(now.getFullYear(), now.getMonth() + 2, 1);
    await prisma.payment.createMany({
        data: [
            {
                loanId: janLoan.id,
                userId: jan.id,
                amount: 975.5,
                dueDate: lastMonth,
                paidAt: new Date(lastMonth.getTime() - 3 * 24 * 60 * 60 * 1000),
                status: "PAID",
                transactionId: "txn_jk_nov_2024",
            },
            {
                loanId: janLoan.id,
                userId: jan.id,
                amount: 975.5,
                dueDate: thisMonth,
                paidAt: new Date(thisMonth.getTime() - 1 * 24 * 60 * 60 * 1000),
                status: "PAID",
                transactionId: "txn_jk_dec_2024",
            },
            {
                loanId: janLoan.id,
                userId: jan.id,
                amount: 975.5,
                dueDate: nextMonth,
                status: "UPCOMING",
            },
            {
                loanId: janLoan.id,
                userId: jan.id,
                amount: 975.5,
                dueDate: monthAfter,
                status: "UPCOMING",
            },
        ],
        skipDuplicates: true,
    });
    // Create payments for Anna
    const annaLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);
    const annaNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 15);
    await prisma.payment.createMany({
        data: [
            {
                loanId: annaLoan.id,
                userId: anna.id,
                amount: 775.8,
                dueDate: annaLastMonth,
                paidAt: new Date(annaLastMonth.getTime() - 1 * 24 * 60 * 60 * 1000),
                status: "PAID",
                transactionId: "txn_an_dec_2024",
            },
            {
                loanId: annaLoan.id,
                userId: anna.id,
                amount: 775.8,
                dueDate: annaNextMonth,
                status: "UPCOMING",
            },
        ],
        skipDuplicates: true,
    });
    console.log("Created payments");
    // Delete existing documents and messages for clean seed
    await prisma.document.deleteMany({});
    await prisma.supportMessage.deleteMany({});
    // Create documents
    await prisma.document.createMany({
        data: [
            {
                userId: jan.id,
                name: "Dowód osobisty - skan.pdf",
                url: "/uploads/documents/jan_id_scan.pdf",
                fileType: "application/pdf",
                fileSize: 1245678,
            },
            {
                userId: jan.id,
                name: "Zaświadczenie o dochodach.pdf",
                url: "/uploads/documents/jan_income.pdf",
                fileType: "application/pdf",
                fileSize: 856432,
            },
            {
                userId: anna.id,
                name: "Umowa o pracę - skan.pdf",
                url: "/uploads/documents/anna_employment.pdf",
                fileType: "application/pdf",
                fileSize: 2134567,
            },
        ],
        skipDuplicates: true,
    });
    console.log("Created documents");
    // Create support messages
    await prisma.supportMessage.createMany({
        data: [
            {
                userId: jan.id,
                subject: "Pytanie o zmianę terminu płatności",
                message: "Dzień dobry, czy mogę przesunąć termin płatności z powodu nieoczekiwanych wydatków? Bardzo proszę o kontakt.",
                status: "OPEN",
            },
            {
                userId: anna.id,
                subject: "Potwierdzenie otrzymania dokumentów",
                message: "Czy moje dokumenty zostały już zweryfikowane?",
                status: "CLOSED",
                adminResponse: "Dzień dobry! Tak, dokumenty zostały przyjęte i zweryfikowane pomyślnie. Dziękujemy.",
                respondedAt: new Date(),
            },
        ],
        skipDuplicates: true,
    });
    console.log("Created support messages");
    // Delete existing audit logs for clean seed
    await prisma.auditLog.deleteMany({});
    // Create audit logs
    await prisma.auditLog.createMany({
        data: [
            {
                action: "USER_LOGIN",
                actorId: jan.id,
                actorEmail: jan.email,
                targetType: "User",
                targetId: jan.id,
                details: { ip: "192.168.1.100", user_agent: "Mozilla/5.0" },
            },
            {
                action: "ADMIN_VIEW_USERS",
                actorEmail: admin.email,
                targetType: "AdminPanel",
                details: { action: "viewed_user_list", count: 3 },
            },
            {
                action: "PAYMENT_PROCESSED",
                actorEmail: jan.email,
                targetType: "Payment",
                details: { amount: 975.5, method: "bank_transfer" },
            },
        ],
        skipDuplicates: true,
    });
    console.log("Created audit logs");
    console.log("Seed completed successfully!");
}
main()
    .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
