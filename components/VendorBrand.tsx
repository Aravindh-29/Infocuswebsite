import { vendors } from "@/lib/vendors";
export default function VendorBrand({
  vendor,
  withName = false,
}: {
  vendor: string;
  withName?: boolean;
}) {
  const data = vendors.find((v) => v.slug === vendor);
  return (
    <span className={"vendor-brand vendor-" + vendor}>
      {vendor === "microsoft" ? (
        <svg viewBox="0 0 48 48" role="img" aria-label="Microsoft">
          <path fill="#f25022" d="M2 2h21v21H2z" />
          <path fill="#7fba00" d="M25 2h21v21H25z" />
          <path fill="#00a4ef" d="M2 25h21v21H2z" />
          <path fill="#ffb900" d="M25 25h21v21H25z" />
        </svg>
      ) : (
        <img
          src={
            vendor === "oracle"
              ? "/brands/oracle.webp"
              : `/brands/${vendor}.svg`
          }
          alt={data?.title || vendor}
        />
      )}
      {withName && <strong>{data?.title || vendor}</strong>}
    </span>
  );
}
