import { PrismaClient, ProjectStatus, TaskPriority, TaskStatus, MilestoneStatus } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seeding...')

    // --- 1. Roles & Users ---
    // Create basic roles
    const adminRole = await prisma.role.upsert({
        where: { name: 'ADMIN' },
        update: {},
        create: { name: 'ADMIN', description: 'System Administrator' },
    })

    const userRole = await prisma.role.upsert({
        where: { name: 'USER' },
        update: {},
        create: { name: 'USER', description: 'Standard User' },
    })

    // Create dummy users (passwords should be hashed using bcrypt in reality, but this is a simple mock for now)
    // In a real Supabase Auth setup, we link this via the ID or Email to the auth.users table
    const user1 = await prisma.user.upsert({
        where: { email: 'admin@inpro.local' },
        update: {},
        create: {
            id: 'usr_admin_001',
            email: 'admin@inpro.local',
            fullName: 'System Admin',
            passwordHash: '$2b$10$dummyHashNotRealBcryptForAdminUser', // dummy hash
            roleId: adminRole.id,
        },
    })

    const user2 = await prisma.user.upsert({
        where: { email: 'manager@buildcorp.local' },
        update: {},
        create: {
            id: 'usr_manager_001',
            email: 'manager@buildcorp.local',
            fullName: 'Project Manager',
            passwordHash: '$2b$10$dummyHashNotRealBcryptForManagerUser',
            roleId: userRole.id,
        },
    })

    console.log('✅ Created roles and users')

    // --- 2. Projects ---
    // Clear existing dummy seed data if rerunning (optional, but good for clean dev state)
    // Delete projects will cascade delete tasks, reports, milestones
    await prisma.project.deleteMany({
        where: { id: { startsWith: 'seed_' } }
    })

    const d = new Date()
    const today = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    const activeProject = await prisma.project.create({
        data: {
            id: 'seed_proj_active_01',
            name: 'Pembangunan Gedung Perkantoran Sudirman',
            client: 'PT Mega Korporat',
            location: 'Jl. Jend. Sudirman Kav 45, Jakarta',
            startDate: lastMonth,
            endDate: nextMonth,
            status: ProjectStatus.ACTIVE,
            picUserId: user2.id,
            progress: 65,
        }
    })

    const completedProject = await prisma.project.create({
        data: {
            id: 'seed_proj_comp_01',
            name: 'Renovasi Interior Hotel Bintang 5',
            client: 'Bali Resort Group',
            location: 'Nusa Dua, Bali',
            startDate: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000),
            endDate: lastWeek,
            status: ProjectStatus.COMPLETED,
            picUserId: user1.id,
            progress: 100,
        }
    })

    const planningProject = await prisma.project.create({
        data: {
            id: 'seed_proj_plan_01',
            name: 'Desain & Bangun Fasilitas Pabrik Cikarang',
            client: 'PT Industri Manufaktur Cemerlang',
            location: 'Kawasan Industri Cikarang, Jawa Barat',
            startDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
            status: ProjectStatus.PLANNING,
            picUserId: user2.id,
            progress: 5,
        }
    })

    const onHoldProject = await prisma.project.create({
        data: {
            id: 'seed_proj_hold_01',
            name: 'Infrastruktur Jembatan dan Jalan Tol',
            client: 'Kementerian PU',
            location: 'Trans Sumatera Seksi 4',
            startDate: lastMonth,
            status: ProjectStatus.ON_HOLD,
            progress: 30,
        }
    })

    console.log('✅ Created dummy projects')

    // --- 3. Milestones ---
    await prisma.milestone.createMany({
        data: [
            {
                id: 'seed_ms_1',
                projectId: activeProject.id,
                title: 'Pondasi Selesai',
                targetDate: lastWeek,
                status: MilestoneStatus.COMPLETED
            },
            {
                id: 'seed_ms_2',
                projectId: activeProject.id,
                title: 'Struktur Lantai 10 Selesai',
                targetDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
                status: MilestoneStatus.IN_PROGRESS
            },
            {
                id: 'seed_ms_3',
                projectId: planningProject.id,
                title: 'Approval Desain Akhir',
                targetDate: new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000),
                status: MilestoneStatus.PENDING
            }
        ]
    })

    console.log('✅ Created milestones')

    // --- 4. Tasks ---
    await prisma.task.createMany({
        data: [
            {
                id: 'seed_task_1',
                projectId: activeProject.id,
                title: 'Pengecoran plat lantai 5',
                description: 'Pengecoran beton mutu K-350 untuk luas 500m2',
                dueDate: today,
                priority: TaskPriority.HIGH,
                status: TaskStatus.IN_PROGRESS,
                assigneeId: user2.id
            },
            {
                id: 'seed_task_2',
                projectId: activeProject.id,
                title: 'Instalasi ME shaft utama',
                description: 'Pemasangan jalur kabel tray dan pipa hydrant',
                dueDate: lastWeek, // Overdue task!
                priority: TaskPriority.CRITICAL,
                status: TaskStatus.BLOCKED,
            },
            {
                id: 'seed_task_3',
                projectId: activeProject.id,
                title: 'Review shop drawing arsitektur',
                dueDate: nextMonth,
                priority: TaskPriority.MEDIUM,
                status: TaskStatus.TODO,
            },
            {
                id: 'seed_task_4',
                projectId: planningProject.id,
                title: 'Survey topografi ulang',
                dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
                priority: TaskPriority.HIGH,
                status: TaskStatus.TODO,
            },
            {
                id: 'seed_task_5',
                projectId: onHoldProject.id,
                title: 'Pembebasan lahan tahap 2',
                dueDate: lastMonth, // Overdue
                priority: TaskPriority.CRITICAL,
                status: TaskStatus.BLOCKED,
            },
            {
                id: 'seed_task_6',
                projectId: completedProject.id,
                title: 'Serah terima kunci (BAST)',
                dueDate: lastWeek,
                priority: TaskPriority.HIGH,
                status: TaskStatus.DONE,
            }
        ]
    })

    console.log('✅ Created tasks (including overdue ones)')

    // --- 5. Daily Reports ---
    await prisma.dailyReport.createMany({
        data: [
            {
                id: 'seed_rep_1',
                projectId: activeProject.id,
                reportDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000), // yesterday
                authorId: user2.id,
                activities: 'Melanjutkan perakitan tulangan balok lantai 5 (70%). Bongkar bekisting kolom axis A-C.',
                weather: 'Cerah, Hujan rintik sore hari',
                manpower: 45,
            },
            {
                id: 'seed_rep_2',
                projectId: activeProject.id,
                reportDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                authorId: user2.id,
                activities: 'Pengecoran kolom lantai 4 selesai 100%. Persiapan scaffolding lantai 5.',
                weather: 'Cerah',
                manpower: 50,
            },
            {
                id: 'seed_rep_3',
                projectId: onHoldProject.id,
                reportDate: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
                authorId: user1.id,
                activities: 'Pekerjaan dihentikan karena instruksi dari owner terkait desain perubahan jalan layang.',
                blockers: 'Menunggu revisi desain dari konsultan perencana.',
                notes: 'Alat berat standby.',
                weather: 'Mendung',
                manpower: 5,
            }
        ]
    })

    console.log('✅ Created daily reports')
    console.log('🎉 Seeding finished successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
