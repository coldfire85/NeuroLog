// Mock database service
// This would be replaced with Prisma in production

// Mock user database
export const USERS = [
  {
    id: "user1",
    email: "neurosurgeon@example.com",
    password: "password123", // NEVER do this in production!
    name: "Dr. Jane Smith",
    image: "https://randomuser.me/api/portraits/women/17.jpg",
  },
  {
    id: "user2",
    email: "admin@neurolog.com",
    password: "admin123", // NEVER do this in production!
    name: "Admin User",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
];

// Mock procedures database
export const PROCEDURES = [
  {
    id: "proc1",
    userId: "user1",
    patientName: "John Doe",
    patientId: "P12345",
    date: new Date("2025-03-10"),
    procedureType: "Cranial",
    diagnosis: "Glioblastoma multiforme",
    // other fields would be here
  },
  {
    id: "proc2",
    userId: "user1",
    patientName: "Jane Smith",
    patientId: "P12346",
    date: new Date("2025-03-05"),
    procedureType: "Spinal",
    diagnosis: "Lumbar disc herniation",
    // other fields would be here
  },
];

// Mock templates database
export const TEMPLATES = [
  {
    id: "template1",
    userId: "user1",
    name: "Craniotomy for Tumor",
    procedureType: "Cranial",
    notes: "Patient positioned supine with head turned. Stealth navigation system used for localization. Linear incision made. Craniotomy performed with high-speed drill. Dura opened in cruciate fashion. Tumor identified and gross total resection achieved using microscope and microsurgical technique. Hemostasis obtained. Dura closed in watertight fashion. Bone flap secured. Scalp closed in layers.",
    complications: "None",
    outcome: "Patient awoke without neurological deficits. Post-operative imaging showed complete resection.",
    followUp: "Follow-up in 2 weeks with post-operative imaging. Refer to oncology for adjuvant therapy discussion.",
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-15"),
  },
  {
    id: "template2",
    userId: "user1",
    name: "Lumbar Discectomy",
    procedureType: "Spinal",
    notes: "Patient positioned prone on Wilson frame. Fluoroscopy used to identify level. Midline incision made. Paravertebral muscles dissected and retracted. Laminotomy performed. Ligamentum flavum removed. Nerve root identified and retracted medially. Disc herniation identified and removed. Foraminotomy performed to decompress nerve root. Hemostasis obtained. Wound closed in layers.",
    complications: "None",
    outcome: "Patient's radicular pain improved immediately post-op. Motor and sensory functions intact.",
    followUp: "Follow-up in 2 weeks. Physical therapy to begin in 3 weeks.",
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-01-20"),
  },
  {
    id: "template3",
    userId: "user1",
    name: "VP Shunt Placement",
    procedureType: "Cranial",
    notes: "Patient positioned supine. Linear incision made in right occipital area. Burr hole placed. Ventricular catheter inserted into right lateral ventricle with stereotactic guidance. CSF return confirmed. Tunneled subcutaneously to peritoneal cavity. Peritoneal catheter placed under direct visualization. Valve connected and secured. Incisions closed in layers.",
    complications: "None",
    outcome: "Post-op CT confirmed good catheter placement. Patient's symptoms of increased ICP resolved.",
    followUp: "Follow-up in 1 week for wound check and shunt series.",
    createdAt: new Date("2025-02-05"),
    updatedAt: new Date("2025-02-05"),
  },
];

// Mock database methods
export const db = {
  user: {
    findUnique: async ({ where }: { where: { email: string } }) => {
      return USERS.find(user => user.email === where.email) || null;
    }
  },
  procedure: {
    findMany: async ({ where }: { where: { userId: string } }) => {
      return PROCEDURES.filter(proc => proc.userId === where.userId);
    }
  },
  template: {
    findMany: async ({ where }: { where: { userId: string } }) => {
      return TEMPLATES.filter(template => template.userId === where.userId);
    },
    findUnique: async ({ where }: { where: { id: string } }) => {
      return TEMPLATES.find(template => template.id === where.id) || null;
    },
    create: async ({ data }: { data: any }) => {
      const newTemplate = {
        id: `template${TEMPLATES.length + 1}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      };
      TEMPLATES.push(newTemplate);
      return newTemplate;
    },
    update: async ({ where, data }: { where: { id: string }, data: any }) => {
      const index = TEMPLATES.findIndex(template => template.id === where.id);
      if (index === -1) throw new Error("Template not found");

      TEMPLATES[index] = {
        ...TEMPLATES[index],
        ...data,
        updatedAt: new Date(),
      };

      return TEMPLATES[index];
    },
    delete: async ({ where }: { where: { id: string } }) => {
      const index = TEMPLATES.findIndex(template => template.id === where.id);
      if (index === -1) throw new Error("Template not found");

      const deleted = TEMPLATES[index];
      TEMPLATES.splice(index, 1);
      return deleted;
    }
  }
};
