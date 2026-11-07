export type ServiceNarrative = {
  heading: string;
  context: string;
  approach: string;
  example: string;
  outputs: string[];
};
export const narratives: Record<string, ServiceNarrative> = {
  cloud: {
    heading: "Move to the cloud with a reason, and a route.",
    context:
      "An ageing infrastructure estate can hold back new ideas, but moving everything at once can create a different kind of complexity. The useful question is which workloads should change first, and how that change will improve the way your business operates.",
    approach:
      "We connect workload assessment, migration planning and cloud architecture with the practical needs of ongoing operations. Public, private and hybrid options are considered in the context of application dependencies, business continuity, governance and cost visibility.",
    example:
      "Planning a phased migration? Start with a workload group, map its dependencies, define the target environment and establish how the team will operate it after the move.",
    outputs: [
      "A prioritised view of workloads and dependencies",
      "A target architecture and phased transition plan",
      "Operating responsibilities and improvement priorities",
    ],
  },
  applications: {
    heading: "Modern applications. Better everyday experiences.",
    context:
      "When applications become difficult to change, the effect reaches beyond IT. Teams work around limitations, customer experiences become inconsistent and every new requirement adds effort. Modernisation should address the friction that matters most.",
    approach:
      "We help connect application design, cloud-native development and SaaS lifecycle management to a practical evolution plan. Integration, maintainability and day-to-day support are part of the conversation from the beginning.",
    example:
      "Updating a business application? Identify the journeys that need improvement, review the interfaces they depend on and sequence releases around a clear operational need.",
    outputs: [
      "Application priorities grounded in business use",
      "A modernisation and integration roadmap",
      "A delivery approach that includes application operations",
    ],
  },
  enterprise: {
    heading: "Give every function a clearer view of the business.",
    context:
      "Finance, operations and customer-facing teams often depend on different applications and different versions of the same information. Connecting those systems is an opportunity to improve how the organisation coordinates its work.",
    approach:
      "Our enterprise approach brings Oracle ERP, CRM integration and business process architecture together. We look at the data, handoffs and responsibilities behind the applications, so the technology supports a coherent operating model.",
    example:
      "Connecting customer orders with finance? Start by agreeing the process, the authoritative data and the exceptions that need human attention before designing the application interfaces.",
    outputs: [
      "An agreed view of business processes and system ownership",
      "An enterprise architecture with defined integrations",
      "A sequence for implementation, validation and improvement",
    ],
  },
  automation: {
    heading: "Give your people their momentum back.",
    context:
      "Repeated data entry, manual approvals and disconnected handoffs can slow even a capable team. Automation works best when the underlying process is understood and the exceptions are considered alongside the routine steps.",
    approach:
      "Using integration and visual workflow capabilities, we help connect applications and organise repeatable business processes. The focus is on a workflow people can understand, monitor and adapt as requirements change.",
    example:
      "Simplifying an approval process? Map the request, decision points, system updates and exception path, then automate the repeatable steps while retaining the right human oversight.",
    outputs: [
      "A process map with clear triggers and responsibilities",
      "Connected workflows and defined exception handling",
      "A plan for visibility, adoption and continued refinement",
    ],
  },
  managed: {
    heading: "Keep the business moving after the launch.",
    context:
      "A platform that is live still needs attention. Application changes, infrastructure demands and operational issues all compete for the time of your technology team. A structured operating approach makes that work easier to see and prioritise.",
    approach:
      "We bring application operations, managed hosting and infrastructure support into a shared view of the environment. The aim is to connect operational visibility with practical improvements, so maintenance and evolution support the same business priorities.",
    example:
      "Bringing a new cloud environment into operation? Define the systems in scope, establish ownership and escalation routes, and agree how improvement opportunities will be reviewed.",
    outputs: [
      "A clear scope for applications and infrastructure",
      "Defined operating responsibilities and support processes",
      "An improvement backlog linked to business priorities",
    ],
  },
  "oracle-integration-cloud": {
    heading: "Make connection a lasting capability.",
    context:
      "Most organisations run a mix of SaaS platforms, on-premises applications and established business processes. Each new connection can introduce another dependency. Over time, the challenge is maintaining a reliable integration landscape as those systems change.",
    approach:
      "We use Oracle Integration Cloud to connect application interfaces, process automation and integration visibility in one considered approach. Start with a valuable business flow, design the data mapping and exception handling, then build a foundation that is easier to extend.",
    example:
      "Connecting an application to ERP? Trace the flow from the originating transaction to the destination record, including validation, status updates and the route for resolving an exception.",
    outputs: [
      "A prioritised integration inventory and dependency map",
      "Defined application flows, mappings and orchestration",
      "Monitoring and exception-handling responsibilities",
    ],
  },
  "oracle-erp": {
    heading: "Create a stronger centre for your enterprise.",
    context:
      "ERP decisions influence how finance and operations work every day. An implementation needs more than the right modules: it needs processes that make sense, information people can use and connections to the systems around it.",
    approach:
      "We align Oracle ERP architecture and implementation with business requirements, enterprise integration and ongoing optimisation. The focus is on making the application landscape coherent while giving teams a practical route through change.",
    example:
      "Reviewing an ERP environment? Begin with the most important business processes, identify where information is duplicated or delayed, and use those findings to prioritise architecture and integration work.",
    outputs: [
      "Business requirements connected to ERP capabilities",
      "Architecture and integration priorities",
      "A plan for implementation and continuing optimisation",
    ],
  },
  "oracle-integration": {
    heading: "Turn a collection of interfaces into a connected architecture.",
    context:
      "A business process rarely stays inside one application. Customer requests, operational updates and financial information cross system boundaries, and every boundary needs a clear understanding of data, timing and ownership.",
    approach:
      "We bring application connectivity, service orchestration and data integration together across cloud and on-premises environments. A coherent integration design helps teams understand the end-to-end flow and manage changes with a wider view of their impact.",
    example:
      "Improving an order-to-fulfilment flow? Map the applications involved, agree the status transitions and identify the points where errors or delays require intervention.",
    outputs: [
      "An end-to-end view of applications and data flows",
      "Interface and orchestration design priorities",
      "A practical approach to change, validation and support",
    ],
  },
  "oracle-rodod": {
    heading: "Connect the promise to the delivery.",
    context:
      "For communications providers, commercial offers and fulfilment systems evolve at different speeds. A new service can involve several channels, systems and delivery steps. Keeping those layers connected is central to a manageable order lifecycle.",
    approach:
      "Oracle Communications Rapid Offer Design and Order Delivery brings offer design and order management into a coordinated approach. We focus on the relationships between commercial offers, orchestration and fulfilment, with visibility across the process.",
    example:
      "Introducing a new communications offer? Understand how its commercial definition maps to fulfilment tasks, which systems carry each step and how the order status is made visible.",
    outputs: [
      "A connected view of offer and order processes",
      "Orchestration and fulfilment integration priorities",
      "Defined lifecycle status and exception-management needs",
    ],
  },
};
export const platformNarratives: Record<
  string,
  { intro: string; focus: [string, string][] }
> = {
  oracle: {
    intro:
      "Oracle applications often sit at the centre of the business. The opportunity is to connect that core to the wider environment, making information and processes work coherently across ERP, integration and cloud infrastructure.",
    focus: [
      [
        "Enterprise processes",
        "Align application decisions with finance, operations and the way information moves between teams.",
      ],
      [
        "Application integration",
        "Connect Oracle applications with SaaS and on-premises systems through a defined architecture.",
      ],
      [
        "Continuous improvement",
        "Keep architecture, integration and operations aligned as business needs change.",
      ],
    ],
  },
  aws: {
    intro:
      "A move to AWS is an opportunity to rethink how applications are built and operated. Start with the workloads and business goals, then shape a cloud foundation that the team can manage and improve over time.",
    focus: [
      [
        "Migration priorities",
        "Assess dependencies and sequence workload transitions around business needs.",
      ],
      [
        "Application evolution",
        "Consider cloud-native approaches where they address a clear delivery or operational requirement.",
      ],
      [
        "Operational readiness",
        "Include governance, ownership and cost visibility in the plan from the beginning.",
      ],
    ],
  },
  azure: {
    intro:
      "For organisations with an established Microsoft environment, Azure can form part of a connected cloud strategy. Consider the relationship between existing systems, new applications and ongoing operations before choosing the transition path.",
    focus: [
      [
        "Hybrid architecture",
        "Understand what stays, what moves and how environments will connect.",
      ],
      [
        "Application modernisation",
        "Prioritise the changes that support better business workflows and application delivery.",
      ],
      [
        "A connected environment",
        "Bring infrastructure and enterprise application decisions into a shared roadmap.",
      ],
    ],
  },
  microsoft: {
    intro:
      "Collaboration platforms and enterprise applications should help people work with shared information. A considered Microsoft environment connects everyday productivity with the processes and systems that support the wider organisation.",
    focus: [
      [
        "Everyday collaboration",
        "Review how Microsoft 365, Exchange and SharePoint support information sharing and team workflows.",
      ],
      [
        "Enterprise connections",
        "Consider how Dynamics 365 relates to customer information and other business applications.",
      ],
      [
        "Practical adoption",
        "Align the application landscape with the way people work and the responsibilities of the operating team.",
      ],
    ],
  },
  "google-cloud": {
    intro:
      "A useful cloud strategy is shaped by the applications and information it needs to support. Explore Google Cloud in the context of the whole technology estate, including the connections and operating practices a transition requires.",
    focus: [
      [
        "Cloud foundations",
        "Connect infrastructure choices to workload and operational requirements.",
      ],
      [
        "Modern applications",
        "Identify opportunities to improve the way applications are developed and delivered.",
      ],
      [
        "Integrated operations",
        "Define how the environment fits into your broader cloud and application strategy.",
      ],
    ],
  },
  sap: {
    intro:
      "Enterprise processes depend on the connections around SAP as much as the application itself. A coherent integration and infrastructure approach helps bring these systems into the wider technology landscape.",
    focus: [
      [
        "Process context",
        "Understand the operational workflows and information dependencies around the enterprise application.",
      ],
      [
        "Integration design",
        "Plan how information will move between SAP and connected business systems.",
      ],
      [
        "Infrastructure alignment",
        "Consider the platform and operating requirements alongside application priorities.",
      ],
    ],
  },
  salesforce: {
    intro:
      "Customer-facing teams need information from across the business. Connect CRM platform decisions with enterprise integration and operational needs to create a more consistent view of the customer journey.",
    focus: [
      [
        "CRM priorities",
        "Begin with the customer processes and information needs that matter most.",
      ],
      [
        "Enterprise connectivity",
        "Understand how CRM information connects with finance, operations and service applications.",
      ],
      [
        "Application operations",
        "Plan for the ongoing support and evolution of the connected application environment.",
      ],
    ],
  },
  openstack: {
    intro:
      "Private cloud can be part of a broader infrastructure strategy when dedicated environments and operational control are priorities. The architecture should reflect workload needs and the capabilities required to run it.",
    focus: [
      [
        "Workload fit",
        "Evaluate the requirements that make a dedicated private environment relevant.",
      ],
      [
        "Connected infrastructure",
        "Consider how private cloud relates to existing infrastructure and public cloud services.",
      ],
      [
        "Operating model",
        "Define responsibilities for hosting, maintenance and ongoing infrastructure support.",
      ],
    ],
  },
};
