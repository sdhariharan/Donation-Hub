# 🌍 DonationHub
## 📖 Project Overview

**DonationHub** is a full-stack donation management platform built to solve a simple but persistent problem: donors want to give, but they don't always know *who* needs *what*. Rather than leaving donors to manually search for a suitable NGO, DonationHub uses an intelligent recommendation engine to match every donated item with the verified organization best positioned to use it — based on real inventory, real demand, and real urgency.

Every donation is fully trackable from the moment it's listed to the moment it reaches a beneficiary, giving donors complete visibility into the difference they're making.

---

##  Problem Statement

Individuals regularly want to donate clothes, books, furniture, stationery, toys, and other reusable household items — but the process of finding the right recipient organization is fragmented and inefficient.

- 📦 Some organizations receive **excessive donations** while others face **shortages**
- 🕳️ Donors have **no visibility** into where their donated items actually go
- 🗂️ Organizations rely on **manual inventory management**
- ❓ Donors have **no way to know** which organization needs a particular item most
- 📵 There is **no transparent tracking** from donation to beneficiary
- ⚖️ Resource distribution across organizations remains **highly unbalanced**

---

## 🔍 Existing Solution

Most current donation platforms function as simple listing directories. The typical workflow looks like this:

> **Donor → Search NGO → Contact NGO → Donate**

This approach comes with several structural limitations:

|           Limitation           |                 Impact                             |
| Manual organization search     | Slow and inefficient for donors                    |
| No organization recommendation | Donations don't reach where they're needed most    |
| No inventory balancing         | Some NGOs are over-supplied, others under-supplied |
| No demand-aware matching       | Items often go where they aren't actually needed   |
| No donation tracking           | Donors lose visibility after handoff               |
| No transparency                | Trust in the process erodes over time              |
| Duplicate donations            | Wasted effort on both sides                        |

---

## 💡 Proposed Solution

**DonationHub** reimagines the donation pipeline as a connected, demand-aware system.

Instead of leaving donors to manually pick an organization, the platform's **Smart Recommendation Engine** analyzes:

- 📊 **Current inventory** — what an organization already has
- 🎯 **Required items** — what an organization actually needs
- 🏷️ **Item category** — matching donation type to demand
- 📍 **Distance** — minimizing logistics overhead
- 🚨 **Priority / urgency** — surfacing time-sensitive needs first

This ensures every donated item is directed to the verified organization that needs it most, while balancing supply across the network instead of concentrating it in a few well-known NGOs.

Once a donation is made, donors can track its full lifecycle, and monitor their cumulative contribution through a dedicated **Impact Dashboard**.

---

## ✨ Core Features

### 🎯 Smart Organization Recommendation
Every donation is matched to a verified organization using current inventory, required items, item category, distance, and priority — preventing over-supply at some organizations and shortages at others.

### 📦 Donation Tracking
Donors can follow their contribution through every stage of its journey:

```
Donation Uploaded → Organization Accepted → Self Delivery / Pickup Request 
→ Donation Received → Distributed to Beneficiaries → Completed
```

### 📈 Donor Impact Dashboard
A personalized dashboard that turns generosity into visible impact, displaying:

- Total Donations
- Total Items Donated
- Organizations Supported
- Beneficiaries Reached
- Donation History

### 🚚 Flexible Delivery
Donors can choose the method that works best for them:

1. **Self Delivery** — drop off items directly
2. **Pickup Request** — request a pickup, which the organization can accept or decline

---

## 🛠️ Technology Stack

| Layer              | Technologies                                   |
| **Frontend**       | React.js · Tailwind CSS · React Router · Axios |
| **Backend**        | Node.js · Express.js                           |
| **Database**       | FireBase                                       |
| **Authentication** | JWT (JSON Web Tokens)                          |
| **Maps & Location**| Google Maps API                                |
| **Deployment**     | Vercel (Frontend) · Render (Backend)           |

**DonationHub** — *Because every donation deserves to find its purpose.* 💚


