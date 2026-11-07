export const vendors = [
  {
    slug: "oracle",
    title: "Oracle",
    headline: "Connect your enterprise. Unlock your next advantage.",
    description:
      "Bring enterprise applications, integration and cloud infrastructure together with Infocus Oracle expertise.",
    color: "#c74634",
    nodes: ["Applications", "Integration", "Business insight"],
    image: "oracle-expertise 1.webp",
  },
  {
    slug: "aws",
    title: "Amazon Web Services",
    headline: "Build with freedom. Scale with confidence.",
    description:
      "Shape your cloud journey around your business. Explore migration, application modernization and ongoing cloud operations on AWS.",
    color: "#d78308",
    nodes: ["Cloud foundation", "Applications", "Operations"],
    image: "t1.webp",
  },
  {
    slug: "azure",
    title: "Microsoft Azure",
    headline: "A connected cloud. A stronger business.",
    description:
      "Connect your infrastructure and applications with a cloud strategy built around Microsoft Azure and your existing technology environment.",
    color: "#0078d4",
    nodes: ["Hybrid cloud", "Applications", "Connected data"],
    image: "t2.webp",
  },
  {
    slug: "microsoft",
    title: "Microsoft",
    headline: "Bring your people and platforms together.",
    description:
      "Connect everyday collaboration and enterprise workflows across Microsoft 365, SharePoint, Exchange and Dynamics 365.",
    color: "#0078d4",
    nodes: ["Microsoft 365", "SharePoint", "Dynamics 365"],
    image: "careers.webp",
  },
  {
    slug: "google-cloud",
    title: "Google Cloud",
    headline: "Make more room for your next idea.",
    description:
      "Explore a flexible cloud foundation for connected applications, modern infrastructure and evolving business needs.",
    color: "#4285f4",
    nodes: ["Infrastructure", "Applications", "Data"],
    image: "t3.webp",
  },
  {
    slug: "sap",
    title: "SAP",
    headline: "Connect the processes that power your business.",
    description:
      "Bring enterprise applications into a coherent technology landscape, with integration and infrastructure aligned to your operations.",
    color: "#0070ad",
    nodes: ["Enterprise systems", "Integration", "Operations"],
    image: "greater.webp",
  },
  {
    slug: "salesforce",
    title: "Salesforce",
    headline: "Put connection at the heart of customer experience.",
    description:
      "Explore CRM platform advisory, enterprise integration and application operations focused on your business needs.",
    color: "#00a1e0",
    nodes: ["Customer experience", "CRM", "Integration"],
    image: "why.webp",
  },
  {
    slug: "openstack",
    title: "OpenStack Private Cloud",
    headline: "A cloud foundation shaped around you.",
    description:
      "Explore dedicated private cloud infrastructure as part of a connected enterprise technology strategy.",
    color: "#da1a32",
    nodes: ["Private cloud", "Infrastructure", "Operations"],
    image: "t5.webp",
  },
];
export function vendorForName(name: string) {
  if (/oracle/i.test(name)) return "oracle";
  if (/azure/i.test(name)) return "azure";
  if (/amazon|aws/i.test(name)) return "aws";
  if (/google/i.test(name)) return "google-cloud";
  if (/sap/i.test(name)) return "sap";
  if (/salesforce/i.test(name)) return "salesforce";
  if (/openstack/i.test(name)) return "openstack";
  if (/microsoft/i.test(name)) return "microsoft";
  return "";
}
