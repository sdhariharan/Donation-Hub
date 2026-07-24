import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import {
  DONATION_CATEGORIES,
  DONATION_CONDITIONS,
  DONATION_STATUSES,
  URGENCY_LEVELS,
  USER_ROLES,
} from '../src/common/constants.js'

const EXPECTED_PROJECT_ID = 'kindred-38d55'
const SERVICE_ACCOUNT_PATH = resolve('serviceAccountKey.json')
const DEMO_PASSWORD = 'Kindred@123'
const CATEGORIES = Object.values(DONATION_CATEGORIES)
const STATUS_ORDER = Object.values(DONATION_STATUSES)

const donors = [
  {
    key: 'donor1',
    email: 'donor1@kindred-demo.test',
    name: 'Aarav Mehta',
    phone: '+91 98765 41001',
    address: '14 Marine View Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
  },
  {
    key: 'donor2',
    email: 'donor2@kindred-demo.test',
    name: 'Diya Sharma',
    phone: '+91 98765 41002',
    address: '28 FC Road',
    city: 'Pune',
    state: 'Maharashtra',
    postalCode: '411004',
  },
  {
    key: 'donor3',
    email: 'donor3@kindred-demo.test',
    name: 'Rohan Patel',
    phone: '+91 98765 41003',
    address: '36 Navrangpura Main Road',
    city: 'Ahmedabad',
    state: 'Gujarat',
    postalCode: '380009',
  },
  {
    key: 'donor4',
    email: 'donor4@kindred-demo.test',
    name: 'Ananya Iyer',
    phone: '+91 98765 41004',
    address: '19 Race Course Road',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    postalCode: '641018',
  },
  {
    key: 'donor5',
    email: 'donor5@kindred-demo.test',
    name: 'Kabir Singh',
    phone: '+91 98765 41005',
    address: '42 Lajpat Nagar',
    city: 'Delhi',
    state: 'Delhi',
    postalCode: '110024',
  },
]

const organizations = [
  {
    key: 'org1',
    email: 'org1@kindred-demo.test',
    adminName: 'Helping Hands Admin',
    name: 'Helping Hands Foundation',
    description:
      'Supports school-age children and families through education, clothing, and nutrition programs.',
    phone: '+91 422 410 1001',
    address: '17 Avinashi Road',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    postalCode: '641018',
    categoriesAccepted: [
      DONATION_CATEGORIES.EDUCATION,
      DONATION_CATEGORIES.CLOTHING,
      DONATION_CATEGORIES.FOOD,
    ],
    trustScore: 88,
    inventory: { education: 4, clothing: 10, food: 18 },
    needs: [
      ['demo-org1-school-books', 'education', 'School Books', 100, 15, 'high', 'Age-appropriate books for community learning centers.'],
      ['demo-org1-school-uniforms', 'clothing', 'School Uniforms', 60, 10, 'medium', 'Clean school uniforms in a range of children’s sizes.'],
    ],
  },
  {
    key: 'org2',
    email: 'org2@kindred-demo.test',
    adminName: 'Bright Futures Admin',
    name: 'Bright Futures Trust',
    description:
      'Improves access to education, digital learning, and personal hygiene resources for underserved students.',
    phone: '+91 22 4100 2002',
    address: '52 Dadar East',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400014',
    categoriesAccepted: [
      DONATION_CATEGORIES.EDUCATION,
      DONATION_CATEGORIES.ELECTRONICS,
      DONATION_CATEGORIES.HYGIENE,
    ],
    trustScore: 92,
    inventory: { education: 20, electronics: 2, hygiene: 12 },
    needs: [
      ['demo-org2-laptops', 'electronics', 'Laptops', 20, 3, 'high', 'Working laptops for supervised digital-learning labs.'],
      ['demo-org2-notebooks', 'education', 'Notebooks', 200, 45, 'medium', 'Unused ruled notebooks for the new school term.'],
    ],
  },
  {
    key: 'org3',
    email: 'org3@kindred-demo.test',
    adminName: 'Care Circle Admin',
    name: 'Care Circle',
    description:
      'Coordinates community health, hygiene, and food assistance for vulnerable households in Pune.',
    phone: '+91 20 4100 3003',
    address: '11 Koregaon Park Road',
    city: 'Pune',
    state: 'Maharashtra',
    postalCode: '411001',
    categoriesAccepted: [
      DONATION_CATEGORIES.MEDICAL,
      DONATION_CATEGORIES.HYGIENE,
      DONATION_CATEGORIES.FOOD,
    ],
    trustScore: 81,
    inventory: { medical: 8, hygiene: 5, food: 14 },
    needs: [
      ['demo-org3-hygiene-kits', 'hygiene', 'Hygiene Kits', 150, 40, 'high', 'Sealed kits containing everyday personal-care essentials.'],
      ['demo-org3-dry-food-kits', 'food', 'Dry Food Kits', 100, 25, 'medium', 'Shelf-stable staple food kits for household distribution.'],
    ],
  },
  {
    key: 'org4',
    email: 'org4@kindred-demo.test',
    adminName: 'Hope Foundation Admin',
    name: 'Hope Foundation',
    description:
      'Provides practical household, clothing, and education support to families rebuilding financial stability.',
    phone: '+91 79 4100 4004',
    address: '24 Ashram Road',
    city: 'Ahmedabad',
    state: 'Gujarat',
    postalCode: '380009',
    categoriesAccepted: [
      DONATION_CATEGORIES.CLOTHING,
      DONATION_CATEGORIES.HOUSEHOLD,
      DONATION_CATEGORIES.EDUCATION,
    ],
    trustScore: 76,
    inventory: { clothing: 7, household: 3, education: 30 },
    needs: [
      ['demo-org4-winter-clothes', 'clothing', 'Winter Clothes', 80, 20, 'high', 'Clean winter layers suitable for adults and children.'],
      ['demo-org4-study-tables', 'household', 'Study Tables', 15, 2, 'low', 'Compact, sturdy tables for students with limited study space.'],
    ],
  },
  {
    key: 'org5',
    email: 'org5@kindred-demo.test',
    adminName: 'Community Bridge Admin',
    name: 'Community Bridge',
    description:
      'Connects Delhi communities with food, learning materials, and responsible access to reusable technology.',
    phone: '+91 11 4100 5005',
    address: '63 Lodhi Road',
    city: 'Delhi',
    state: 'Delhi',
    postalCode: '110003',
    categoriesAccepted: [
      DONATION_CATEGORIES.FOOD,
      DONATION_CATEGORIES.EDUCATION,
      DONATION_CATEGORIES.ELECTRONICS,
      DONATION_CATEGORIES.OTHER,
    ],
    trustScore: 85,
    inventory: { food: 9, education: 6, electronics: 11, other: 5 },
    needs: [
      ['demo-org5-school-books', 'education', 'School Books', 75, 5, 'high', 'Current school books for neighborhood learning groups.'],
      ['demo-org5-smartphones', 'electronics', 'Smartphones', 25, 4, 'medium', 'Working smartphones that can support essential online access.'],
    ],
  },
]

const donationDefinitions = [
  ['demo-donation-01', 'donor1', 'School Books', 'education', 30, 'good', null, 'Uploaded'],
  ['demo-donation-02', 'donor1', 'Laptops', 'electronics', 3, 'like-new', 'org2', 'Uploaded'],
  ['demo-donation-03', 'donor2', 'Hygiene Kits', 'hygiene', 20, 'new', 'org3', 'Accepted'],
  ['demo-donation-04', 'donor2', 'Dry Food Kits', 'food', 15, 'new', 'org3', 'Ready for Pickup'],
  ['demo-donation-05', 'donor3', 'Winter Clothes', 'clothing', 25, 'good', 'org4', 'Received'],
  ['demo-donation-06', 'donor3', 'School Books', 'education', 40, 'good', 'org5', 'Completed'],
  ['demo-donation-07', 'donor4', 'School Uniforms', 'clothing', 12, 'good', 'org1', 'Accepted'],
  ['demo-donation-08', 'donor4', 'Notebooks', 'education', 50, 'new', 'org1', 'Completed'],
  ['demo-donation-09', 'donor5', 'Smartphones', 'electronics', 5, 'like-new', 'org5', 'Ready for Pickup'],
  ['demo-donation-10', 'donor5', 'Food Packets', 'food', 35, 'new', null, 'Uploaded'],
]

function timestampAt(dayOffset, minuteOffset = 0) {
  return Timestamp.fromDate(
    new Date(Date.UTC(2026, 0, 10 + dayOffset, 9, minuteOffset)),
  )
}

function completeInventory(values) {
  return Object.fromEntries(
    CATEGORIES.map((category) => [category, values[category] ?? 0]),
  )
}

function validateDefinitions() {
  const validConditions = new Set(Object.values(DONATION_CONDITIONS))
  const validStatuses = new Set(STATUS_ORDER)
  const validUrgencies = new Set(Object.values(URGENCY_LEVELS))

  if (donors.length !== 5 || organizations.length !== 5) {
    throw new Error('Seed definitions must contain exactly five users per role.')
  }
  if (donationDefinitions.length !== 10) {
    throw new Error('Seed definitions must contain exactly ten donations.')
  }
  for (const donation of donationDefinitions) {
    if (!CATEGORIES.includes(donation[3])) throw new Error(`Invalid category in ${donation[0]}.`)
    if (!validConditions.has(donation[5])) throw new Error(`Invalid condition in ${donation[0]}.`)
    if (!validStatuses.has(donation[7])) throw new Error(`Invalid status in ${donation[0]}.`)
    if (donation[7] !== DONATION_STATUSES.UPLOADED && !donation[6]) {
      throw new Error(`${donation[0]} requires an assigned organization.`)
    }
  }
  for (const organization of organizations) {
    for (const need of organization.needs) {
      if (!CATEGORIES.includes(need[1]) || !validUrgencies.has(need[5])) {
        throw new Error(`Invalid need definition for ${organization.key}.`)
      }
    }
  }
}

async function loadServiceAccount() {
  let raw
  try {
    raw = await readFile(SERVICE_ACCOUNT_PATH, 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(
        'serviceAccountKey.json was not found in the project root. Download it locally before running the seed.',
      )
    }
    throw error
  }

  const serviceAccount = JSON.parse(raw)
  if (serviceAccount.project_id !== EXPECTED_PROJECT_ID) {
    throw new Error(
      `The service account must belong to Firebase project ${EXPECTED_PROJECT_ID}.`,
    )
  }
  return serviceAccount
}

async function ensureAuthUsers(auth) {
  const stats = { created: 0, reused: 0, updated: 0 }
  const usersByKey = new Map()

  for (const account of [
    ...donors.map((item) => ({ ...item, displayName: item.name })),
    ...organizations.map((item) => ({
      ...item,
      displayName: item.adminName,
    })),
  ]) {
    let user
    try {
      user = await auth.getUserByEmail(account.email)
      stats.reused += 1
      user = await auth.updateUser(user.uid, {
        displayName: account.displayName,
        password: DEMO_PASSWORD,
        disabled: false,
      })
      stats.updated += 1
    } catch (error) {
      if (error.code !== 'auth/user-not-found') throw error
      user = await auth.createUser({
        email: account.email,
        password: DEMO_PASSWORD,
        displayName: account.displayName,
        emailVerified: true,
      })
      stats.created += 1
    }
    usersByKey.set(account.key, user)
  }

  return { stats, usersByKey }
}

async function seedFirestore(db, usersByKey) {
  const batch = db.batch()
  const stats = {
    users: { created: 0, updated: 0 },
    organizations: { created: 0, updated: 0 },
    donations: { created: 0, updated: 0 },
    tracking: { created: 0, updated: 0 },
  }

  const accountDefinitions = [
    ...donors.map((item) => ({ ...item, role: USER_ROLES.DONOR })),
    ...organizations.map((item) => ({
      ...item,
      name: item.adminName,
      role: USER_ROLES.ORGANIZATION,
    })),
  ]

  for (const [index, account] of accountDefinitions.entries()) {
    const user = usersByKey.get(account.key)
    const reference = db.collection('users').doc(user.uid)
    const existing = await reference.get()
    stats.users[existing.exists ? 'updated' : 'created'] += 1
    const base = {
      uid: user.uid,
      name: account.name,
      email: account.email,
      role: account.role,
      createdAt: timestampAt(-20, index),
      updatedAt: timestampAt(20, index),
    }
    const profile =
      account.role === USER_ROLES.DONOR
        ? {
            ...base,
            phone: account.phone,
            address: account.address,
            city: account.city,
            state: account.state,
            postalCode: account.postalCode,
          }
        : base
    batch.set(reference, profile, { merge: true })
  }

  for (const [index, organization] of organizations.entries()) {
    const owner = usersByKey.get(organization.key)
    const reference = db.collection('organizations').doc(owner.uid)
    const existing = await reference.get()
    stats.organizations[existing.exists ? 'updated' : 'created'] += 1
    const needs = organization.needs.map(
      ([id, category, itemName, quantityNeeded, quantityReceived, urgency, description], needIndex) => ({
        id,
        category,
        itemName,
        quantityNeeded,
        quantityReceived,
        urgency,
        description,
        isActive: true,
        createdAt: timestampAt(-10 + index, needIndex),
        updatedAt: timestampAt(10 + index, needIndex),
      }),
    )
    batch.set(
      reference,
      {
        ownerId: owner.uid,
        name: organization.name,
        description: organization.description,
        email: organization.email,
        phone: organization.phone,
        address: organization.address,
        city: organization.city,
        state: organization.state,
        postalCode: organization.postalCode,
        categoriesAccepted: organization.categoriesAccepted,
        inventory: completeInventory(organization.inventory),
        needs,
        trustScore: organization.trustScore,
        createdAt: timestampAt(-15, index),
        updatedAt: timestampAt(20, index),
      },
      { merge: true },
    )
  }

  for (const [index, definition] of donationDefinitions.entries()) {
    const [id, donorKey, itemName, category, quantity, condition, organizationKey, status] =
      definition
    const donorDefinition = donors.find((item) => item.key === donorKey)
    const donor = usersByKey.get(donorKey)
    const organizationDefinition = organizations.find(
      (item) => item.key === organizationKey,
    )
    const organization = organizationKey
      ? usersByKey.get(organizationKey)
      : null
    const reference = db.collection('donations').doc(id)
    const existing = await reference.get()
    stats.donations[existing.exists ? 'updated' : 'created'] += 1
    const createdAt = timestampAt(index, 0)
    const finalStatusIndex = STATUS_ORDER.indexOf(status)
    const updatedAt = timestampAt(index, finalStatusIndex * 20)

    batch.set(
      reference,
      {
        donorId: donor.uid,
        donorName: donorDefinition.name,
        donorEmail: donorDefinition.email,
        title: itemName,
        category,
        itemName,
        quantity,
        condition,
        description: `${quantity} ${itemName.toLowerCase()} available for a verified community need.`,
        pickupAddress: donorDefinition.address,
        city: donorDefinition.city,
        state: donorDefinition.state,
        postalCode: donorDefinition.postalCode,
        imageUrl: null,
        imagePath: null,
        selectedOrganizationId: organization?.uid ?? null,
        selectedOrganizationName: organizationDefinition?.name ?? null,
        status,
        createdAt,
        updatedAt,
      },
      { merge: true },
    )

    if (finalStatusIndex >= STATUS_ORDER.indexOf(DONATION_STATUSES.ACCEPTED)) {
      const trackingReference = db.collection('tracking').doc(id)
      const existingTracking = await trackingReference.get()
      stats.tracking[existingTracking.exists ? 'updated' : 'created'] += 1
      const statusHistory = STATUS_ORDER.slice(0, finalStatusIndex + 1).map(
        (historyStatus, historyIndex) => ({
          status: historyStatus,
          updatedBy: historyIndex === 0 ? donor.uid : organization.uid,
          updatedByRole:
            historyIndex === 0
              ? USER_ROLES.DONOR
              : USER_ROLES.ORGANIZATION,
          timestamp: timestampAt(index, historyIndex * 20),
        }),
      )
      batch.set(
        trackingReference,
        {
          donationId: id,
          donorId: donor.uid,
          organizationId: organization.uid,
          currentStatus: status,
          statusHistory,
          createdAt: statusHistory[1].timestamp,
          updatedAt: statusHistory.at(-1).timestamp,
        },
        { merge: true },
      )
    }
  }

  await batch.commit()
  return stats
}

async function verifySeed(db, auth, usersByKey) {
  const authUsers = await Promise.all(
    [...donors, ...organizations].map((item) => auth.getUserByEmail(item.email)),
  )
  const userDocuments = await db.getAll(
    ...authUsers.map((user) => db.collection('users').doc(user.uid)),
  )
  const organizationDocuments = await db.getAll(
    ...organizations.map((item) =>
      db.collection('organizations').doc(usersByKey.get(item.key).uid),
    ),
  )
  const donationDocuments = await db.getAll(
    ...donationDefinitions.map(([id]) => db.collection('donations').doc(id)),
  )
  const trackedIds = donationDefinitions
    .filter((item) => item[7] !== DONATION_STATUSES.UPLOADED)
    .map((item) => item[0])
  const trackingDocuments = await db.getAll(
    ...trackedIds.map((id) => db.collection('tracking').doc(id)),
  )

  const totals = {
    authenticationUsers: authUsers.length,
    userDocuments: userDocuments.filter((item) => item.exists).length,
    organizationDocuments: organizationDocuments.filter((item) => item.exists).length,
    donationDocuments: donationDocuments.filter((item) => item.exists).length,
    trackingDocuments: trackingDocuments.filter((item) => item.exists).length,
  }
  const expected = [10, 10, 5, 10, 7]
  if (Object.values(totals).some((value, index) => value !== expected[index])) {
    throw new Error(`Seed verification failed: ${JSON.stringify(totals)}`)
  }
  return totals
}

async function main() {
  validateDefinitions()
  const serviceAccount = await loadServiceAccount()
  const app =
    getApps()[0] ||
    initializeApp({
      credential: cert(serviceAccount),
      projectId: EXPECTED_PROJECT_ID,
    })
  const auth = getAuth(app)
  const db = getFirestore(app)

  console.log(`Seeding deterministic demo data in ${EXPECTED_PROJECT_ID}...`)
  const { stats: authStats, usersByKey } = await ensureAuthUsers(auth)
  const firestoreStats = await seedFirestore(db, usersByKey)
  const totals = await verifySeed(db, auth, usersByKey)

  console.log('Authentication:', authStats)
  console.log('Firestore writes:', firestoreStats)
  console.log('Verified demo totals:', totals)
  console.log('Demo seed completed successfully.')
}

main().catch((error) => {
  console.error(`Demo seed failed: ${error.message}`)
  process.exitCode = 1
})
