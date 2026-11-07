export type ServiceCard = {
  id: string;
  group: "cloud" | "build" | "support";
  vendor?: "oracle" | "azure" | "aws" | "google-cloud";
  icon: string;
  eyebrow: string;
  title: string;
  summary: string;
  points: { title: string; description: string }[];
  outcome: string;
  cta: string;
  related?: { label: string; href: string }[];
  architecture?: {
    foundation: string[];
    primary: string[];
    recovery: string[];
    caption: string;
  };
};

export const serviceCatalog: ServiceCard[] = [
  {
    id: "oracle-cloud",
    group: "cloud",
    vendor: "oracle",
    icon: "cloud",
    eyebrow: "CONNECTED APPLICATIONS. A STRONGER FOUNDATION.",
    title: "Oracle Cloud & Integration",
    summary:
      "Bring infrastructure, enterprise applications and business processes into one considered architecture. We build Oracle Cloud Infrastructure environments from the ground up, connect systems through Oracle Integration Cloud, and support the applications your teams depend on.",
    points: [
      {
        title: "Build your OCI landing zone",
        description:
          "Establish tenancy compartments, identity policies, virtual cloud networks and deployment automation. Design development, test and production environments around clear ownership, network boundaries and the workloads you plan to run.",
      },
      {
        title: "High availability & reliability",
        description:
          "Plan load balancing, health checks and capacity around application dependencies. Use availability domains or fault domains where appropriate to the chosen OCI region, and review how each component behaves during disruption.",
      },
      {
        title: "Disaster recovery, planned and tested",
        description:
          "Define recovery time and recovery point objectives (RTO/RPO), then design backup, replication and recovery arrangements to match. Document restoration and failover steps, validate them through exercises, and keep the plan current.",
      },
      {
        title: "Connect, automate and support",
        description:
          "Use Oracle Integration Cloud to connect Oracle ERP, SaaS applications and on-premises systems. Build monitored integrations and practical exception handling, with ongoing support for infrastructure, applications, interfaces and business users.",
      },
    ],
    outcome:
      "An Oracle environment built to connect your business and keep it moving.",
    cta: "Plan your Oracle environment",
    related: [
      {
        label: "Oracle Integration Cloud",
        href: "/services/oracle-integration-cloud",
      },
      { label: "Oracle ERP expertise", href: "/services/oracle-erp" },
    ],
    architecture: {
      foundation: [
        "Tenancy & compartments",
        "IAM & policies",
        "VCNs & subnets",
      ],
      primary: ["Application tier", "Oracle integrations", "Database services"],
      recovery: [
        "Recovery region",
        "Backup & replication",
        "Restore & failover",
      ],
      caption:
        "A governed OCI foundation connects application and data services, with a recovery design shaped around workload priorities.",
    },
  },
  {
    id: "microsoft-azure",
    group: "cloud",
    vendor: "azure",
    icon: "cloud",
    eyebrow: "YOUR MICROSOFT ENVIRONMENT. READY FOR MORE.",
    title: "Microsoft Azure",
    summary:
      "Give new ideas and established workloads a dependable home in Azure. We bring cloud foundations, application engineering and operational support together, connecting your Microsoft environment with the wider systems and teams that make your business work.",
    points: [
      {
        title: "Create the foundation from scratch",
        description:
          "Build Azure landing zones with management groups, subscriptions, Microsoft Entra ID access and Azure Policy. Establish virtual networks, shared connectivity and repeatable deployment pipelines before introducing business workloads.",
      },
      {
        title: "High availability & reliability",
        description:
          "Choose appropriate compute, data and integration services, then design health checks, scaling and availability-zone resilience where supported. Review dependencies and operational ownership across cloud and hybrid environments.",
      },
      {
        title: "Disaster recovery & backup strategies",
        description:
          "Agree recovery time and data-loss objectives (RTO/RPO), select suitable Azure backup and replication capabilities, and plan recovery locations. Test restore procedures and application recovery together, including identity and network dependencies.",
      },
      {
        title: "Integrate and improve after launch",
        description:
          "Connect business applications, including Oracle systems, through APIs, messaging and workflow services. Add monitoring, release management, patch planning and ongoing technical support so the Azure platform continues to serve changing business needs.",
      },
    ],
    outcome:
      "A connected Azure platform with a clear path from deployment to daily operations.",
    cta: "Shape your Azure roadmap",
    related: [
      { label: "Explore Microsoft Azure", href: "/platforms/azure" },
      { label: "Cloud transformation", href: "/solutions/cloud" },
    ],
    architecture: {
      foundation: [
        "Management groups",
        "Workload subscriptions",
        "Hub-spoke VNets",
      ],
      primary: ["Application tier", "APIs & messaging", "Data services"],
      recovery: [
        "Recovery region",
        "Backup & replication",
        "Recovery runbooks",
      ],
      caption:
        "Shared Azure governance and connectivity support workload subscriptions, with availability and recovery choices tailored to each application.",
    },
  },
  {
    id: "amazon-web-services",
    group: "cloud",
    vendor: "aws",
    icon: "cloud",
    eyebrow: "FROM FIRST WORKLOAD TO EVERYDAY OPERATIONS.",
    title: "Amazon Web Services",
    summary:
      "Build an AWS environment that supports your product today and gives your team room to grow. From a new cloud foundation to application migration and ongoing operations, we connect architecture decisions with practical delivery and support.",
    points: [
      {
        title: "Establish your AWS landing zone",
        description:
          "Organise AWS accounts and organizational units with AWS Organizations, using Control Tower where appropriate. Build VPC networking, access controls, logging and infrastructure as code to create consistent environments from the start.",
      },
      {
        title: "High availability & reliability",
        description:
          "Design applications around suitable AWS compute and data services, load balancing and scaling. Distribute components across Availability Zones where the workload requires it, with monitoring and dependency reviews supporting reliable operation.",
      },
      {
        title: "Disaster recovery & backup strategies",
        description:
          "Translate agreed RTO/RPO targets into backup, restore and disaster recovery arrangements. Evaluate recovery Regions and standby patterns against business priorities, then test restoration and failover rather than relying on an untested plan.",
      },
      {
        title: "Connect services and manage change",
        description:
          "Integrate existing applications, including Oracle systems, through APIs, events and data flows. Support deployments, incidents, patching, configuration and cost reviews, with documentation that helps your team understand and maintain the AWS environment.",
      },
    ],
    outcome:
      "AWS foundations and applications designed for growth, recovery and confident ownership.",
    cta: "Build your AWS foundation",
    related: [
      { label: "Explore AWS", href: "/platforms/aws" },
      { label: "Application modernisation", href: "/solutions/applications" },
    ],
    architecture: {
      foundation: [
        "Organizations & OUs",
        "Workload accounts",
        "VPCs & subnets",
      ],
      primary: ["Application tier", "APIs & events", "Data services"],
      recovery: ["Recovery Region", "Protected backups", "Restore & failover"],
      caption:
        "Account boundaries and VPC networking establish the foundation; workload design determines Availability Zone and recovery Region requirements.",
    },
  },
  {
    id: "google-cloud",
    group: "cloud",
    vendor: "google-cloud",
    icon: "cloud",
    eyebrow: "CONNECTED DATA. WELL-DESIGNED APPLICATIONS.",
    title: "Google Cloud",
    summary:
      "Turn Google Cloud into a practical foundation for applications, connected data and business growth. We design new environments, build and modernise workloads, and bring the monitoring, recovery planning and support needed to operate them with clarity.",
    points: [
      {
        title: "Build your Google Cloud landing zone",
        description:
          "Create an organisation, folder and project structure around your workloads and ownership model. Configure IAM, organisation policies, Shared VPC networking where suitable, central logging and automated environment provisioning.",
      },
      {
        title: "High availability & reliability",
        description:
          "Select managed application, container and data services around real requirements. Plan zonal or regional deployment, load balancing, health checks and scaling according to service capabilities and application dependencies.",
      },
      {
        title: "Disaster recovery & backup strategies",
        description:
          "Define RTO/RPO priorities and select backup, replication and recovery locations accordingly. Document the order in which data, applications and supporting services recover, then exercise restoration and validate the results.",
      },
      {
        title: "Integrate, observe and support",
        description:
          "Connect cloud services with enterprise applications, Oracle systems and data pipelines. Establish monitoring, incident investigation and controlled releases, with ongoing application and infrastructure support as your Google Cloud environment evolves.",
      },
    ],
    outcome:
      "A Google Cloud environment that brings application delivery and operational confidence together.",
    cta: "Plan your Google Cloud build",
    related: [
      { label: "Explore Google Cloud", href: "/platforms/google-cloud" },
      { label: "Connected enterprise", href: "/solutions/enterprise" },
    ],
    architecture: {
      foundation: ["Organisation & folders", "Projects & IAM", "Shared VPC"],
      primary: [
        "Application services",
        "APIs & data pipelines",
        "Data platforms",
      ],
      recovery: [
        "Recovery location",
        "Backup & replication",
        "Restore testing",
      ],
      caption:
        "An organised project hierarchy and shared network connect application and data workloads, with recovery patterns chosen around business needs.",
    },
  },
  {
    id: "enterprise-applications",
    group: "build",
    icon: "code",
    eyebrow: "SOFTWARE BUILT AROUND THE WAY YOU WORK.",
    title: "Full-stack & enterprise applications",
    summary:
      "Create custom software that connects people, processes and information. We build complete applications from user experience through backend services and databases, and modernise existing systems with a clear route from requirements to release and long-term support.",
    points: [
      {
        title: "Start with the work that matters",
        description:
          "Map user roles, business processes and application dependencies. Turn operational pain points into a prioritised delivery plan with clear acceptance criteria, usable prototypes and an architecture that supports the intended scale.",
      },
      {
        title: "Build the complete application",
        description:
          "Deliver responsive interfaces, backend services, APIs and database models as one connected product. Implement access controls, validation and business rules alongside the workflows your customers and internal teams need.",
      },
      {
        title: "Integrate and release with care",
        description:
          "Connect ERP, CRM and external services, plan data migration, and test critical journeys. Use automated delivery pipelines, documented configuration and rollback planning to make releases easier to manage.",
      },
      {
        title: "Support the application as it evolves",
        description:
          "Provide maintenance, defect resolution, performance investigation and new features after launch. Keep technical documentation and user guidance current, whether we built the original system or are taking over an existing application.",
      },
    ],
    outcome:
      "Custom enterprise software with a clear purpose, connected architecture and a supported future.",
    cta: "Discuss your application",
    related: [
      { label: "Application solutions", href: "/solutions/applications" },
      { label: "Enterprise integration", href: "/solutions/enterprise" },
    ],
  },
  {
    id: "startup-product-development",
    group: "build",
    icon: "rocket",
    eyebrow: "AN IDEA WORTH BUILDING. A PRACTICAL WAY TO START.",
    title: "Startup MVP & product development",
    summary:
      "Move from a promising idea to a product people can use. We help founders define a focused first release, build the essential experience and supporting technology, then use real feedback to guide the next stage of development.",
    points: [
      {
        title: "Define the first useful release",
        description:
          "Identify your target users, the problem to solve and the core journey that demonstrates value. Shape an MVP scope, prototype the experience and agree delivery priorities before expanding the feature list.",
      },
      {
        title: "Build product and platform together",
        description:
          "Develop the frontend, APIs, data model and cloud environment needed for a working product. Add authentication, administration and third-party integrations according to the needs of the first release.",
      },
      {
        title: "Launch with a learning plan",
        description:
          "Test essential journeys, prepare deployment and support arrangements, and introduce appropriate product analytics. Gather user feedback and distinguish useful improvements from features that can wait.",
      },
      {
        title: "Grow beyond the MVP",
        description:
          "Improve usability, performance and architecture as demand develops. Provide ongoing maintenance, new capabilities and technical handover so the product can grow with your team and commercial priorities.",
      },
    ],
    outcome:
      "A focused first product and an informed path to its next release.",
    cta: "Bring your product idea",
    related: [{ label: "Our delivery approach", href: "/about" }],
  },
  {
    id: "websites-digital-experiences",
    group: "build",
    icon: "globe",
    eyebrow: "MAKE YOUR FIRST IMPRESSION COUNT.",
    title: "Websites & digital experiences",
    summary:
      "Give your organisation a digital presence that communicates clearly and works beautifully. We create static business websites, managed-content experiences and custom web platforms, bringing thoughtful content, responsive design and dependable engineering into the same delivery process.",
    points: [
      {
        title: "Shape the message and journey",
        description:
          "Organise your services, content and calls to action around what visitors need to understand. Develop a visual direction and page structure that make the next step clear on both desktop and mobile.",
      },
      {
        title: "Build the right website for your needs",
        description:
          "Create static sites, content-managed websites or interactive web applications according to how the site will be used. Build reusable components, responsive layouts and accessible interactions into the implementation.",
      },
      {
        title: "Prepare for a dependable launch",
        description:
          "Test forms, navigation and key journeys across screen sizes. Review page performance, search metadata, hosting, domains and analytics, then provide a clear publishing and content-maintenance process.",
      },
      {
        title: "Keep the experience current",
        description:
          "Support content updates, technical maintenance, dependency upgrades and new sections after launch. Review visitor feedback and evolving business needs to improve the experience over time.",
      },
    ],
    outcome:
      "A distinctive website that helps visitors understand your value and take the next step.",
    cta: "Reimagine your website",
    related: [
      {
        label: "Digital application services",
        href: "/solutions/applications",
      },
    ],
  },
  {
    id: "mobile-applications",
    group: "build",
    icon: "smartphone",
    eyebrow: "PUT THE RIGHT EXPERIENCE IN YOUR USERS’ HANDS.",
    title: "Mobile applications",
    summary:
      "Create mobile experiences that make everyday tasks easier for customers and teams. We develop applications for iOS and Android, connect them to dependable backend services, and support the product through testing, release and ongoing improvement.",
    points: [
      {
        title: "Design around real mobile use",
        description:
          "Understand user journeys, device needs and the environments in which the app will be used. Plan navigation, accessibility and offline behaviour where required, then choose a native or cross-platform approach.",
      },
      {
        title: "Connect the app to your business",
        description:
          "Build mobile interfaces alongside APIs, authentication and data services. Integrate business systems and device capabilities such as notifications, camera or location when they serve a clear user need.",
      },
      {
        title: "Test and prepare for release",
        description:
          "Validate core journeys across agreed devices and operating-system versions. Review performance, permissions and data handling, and prepare store submissions, release configuration and the supporting operational documentation.",
      },
      {
        title: "Support each new version",
        description:
          "Resolve defects, maintain compatibility and improve the app as platforms and user expectations change. Support both the mobile client and its backend, with a roadmap informed by feedback and real usage.",
      },
    ],
    outcome:
      "A mobile product designed for everyday usefulness and continued improvement.",
    cta: "Plan your mobile application",
    related: [
      {
        label: "Application lifecycle services",
        href: "/solutions/applications",
      },
    ],
  },
  {
    id: "databases-data-platforms",
    group: "support",
    icon: "database",
    eyebrow: "DATA YOUR APPLICATIONS CAN DEPEND ON.",
    title: "Databases & data platforms",
    summary:
      "Build a dependable data layer for new applications or improve the systems already in place. We design databases, connect data flows and support migrations, with performance, access, backup and operational ownership considered throughout the lifecycle.",
    points: [
      {
        title: "Design the right data foundation",
        description:
          "Translate business entities and application access patterns into appropriate relational or non-relational models. Plan schemas, indexing, access roles and environment separation around the workload and its expected growth.",
      },
      {
        title: "Build, migrate and connect",
        description:
          "Provision database environments, develop migration scripts and connect applications or reporting services. Validate data mappings, reconcile migrated records and plan cutover steps with the teams that rely on the information.",
      },
      {
        title: "Protect data and test restoration",
        description:
          "Define retention, access and recovery needs, then configure appropriate backups and replication. Test restoration against agreed recovery objectives and document the dependencies required to bring applications back into service.",
      },
      {
        title: "Maintain performance and availability",
        description:
          "Investigate slow queries, review capacity and support database maintenance, patching and upgrades. Monitor the health of new and existing databases, and help application teams resolve data and integration issues.",
      },
    ],
    outcome:
      "A maintainable data foundation, with recovery and performance treated as everyday responsibilities.",
    cta: "Discuss your data platform",
    related: [
      { label: "Cloud infrastructure", href: "/solutions/cloud" },
      { label: "Ongoing operations", href: "/solutions/managed" },
    ],
  },
  {
    id: "application-infrastructure-support",
    group: "support",
    icon: "headset",
    eyebrow: "SUPPORT THE TECHNOLOGY. SUPPORT THE PEOPLE USING IT.",
    title: "Application & infrastructure support",
    summary:
      "Keep new and existing technology useful after it goes live. We host and support enterprise workloads, cloud infrastructure, custom software, databases and integrations, combining technical maintenance with functional assistance, user guidance and training for the people who rely on them.",
    points: [
      {
        title: "Understand and take ownership",
        description:
          "Review your application estate, including ERP, CRM and HCM systems, infrastructure and dependencies. Establish documentation, access, escalation paths and a prioritised maintenance plan, including software developed by your team or an existing supplier.",
      },
      {
        title: "Hosting, operations & L1 / L2 / L3 support",
        description:
          "Build and manage application hosting environments, monitor health, and provide L1 / L2 / L3 support across the agreed scope. Coordinate incidents, patches, configuration changes and releases, alongside backup checks, restore exercises and capacity reviews.",
      },
      {
        title: "Help users get work done",
        description:
          "Provide functional and nontechnical assistance with application workflows, access requests and everyday usage questions. Create practical guides, onboarding materials and training sessions that help users work confidently with new or existing software.",
      },
      {
        title: "Improve the service over time",
        description:
          "Review recurring issues, user feedback and operational trends with your team. Prioritise fixes and enhancements, update knowledge articles and runbooks, and make support ownership clear as business processes and technology change.",
      },
    ],
    outcome:
      "Clearer ownership, better-informed users and a practical plan for keeping technology healthy.",
    cta: "Plan your support approach",
    related: [
      { label: "Managed services", href: "/solutions/managed" },
      { label: "Talk to our team", href: "/contact" },
    ],
  },
];

// Official architecture references used to verify platform terminology and
// recovery concepts. These support the conceptual diagrams, not a claim of
// vendor partnership or a promise of a particular availability/recovery result.
export const serviceArchitectureSources: {
  vendor: NonNullable<ServiceCard["vendor"]>;
  title: string;
  url: string;
}[] = [
  {
    vendor: "oracle",
    title: "OCI Core Landing Zone",
    url: "https://docs.oracle.com/en-us/iaas/Content/cloud-adoption-framework/oci-core-landing-zone.htm",
  },
  {
    vendor: "oracle",
    title: "Plan Your Disaster Recovery Strategy",
    url: "https://docs.oracle.com/en/solutions/oci-best-practices/plan-your-disaster-recovery-strategy.html",
  },
  {
    vendor: "azure",
    title: "What is an Azure landing zone?",
    url: "https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/index",
  },
  {
    vendor: "azure",
    title: "Business continuity and disaster recovery",
    url: "https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/design-area/management-business-continuity-disaster-recovery",
  },
  {
    vendor: "aws",
    title: "How AWS Control Tower works",
    url: "https://docs.aws.amazon.com/controltower/latest/userguide/how-control-tower-works.html",
  },
  {
    vendor: "aws",
    title: "Use defined recovery strategies to meet the recovery objectives",
    url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_planning_for_recovery_disaster_recovery.html",
  },
  {
    vendor: "google-cloud",
    title: "Landing zone design in Google Cloud",
    url: "https://docs.cloud.google.com/architecture/landing-zones",
  },
  {
    vendor: "google-cloud",
    title: "Disaster recovery planning guide",
    url: "https://docs.cloud.google.com/architecture/dr-scenarios-planning-guide",
  },
];
