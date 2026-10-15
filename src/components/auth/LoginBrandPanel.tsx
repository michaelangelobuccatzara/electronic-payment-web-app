const LOGO_URL =
  "https://lh3.googleusercontent.com/aida/AEtjO1We0JsHN99A_BKjIcLkDLZRyPVuC46f3G7QqeZ6VDKYWnIiNBvcXaH39lfrKsDT3BWQW5VWiMjs_z5GNJmtvXckr7LlWI67whmac_wOavwKYbsTiGjVGP5UNPjhHz6mk_eMyPnYea8MWq8eaoMoaB3L01Q-4pmCXn8VQ1AbE4gKTtM2QLzjZu4gwzFgBGggH1T8Err4hglphJH7PGgcGuowbogYekRHAv8csnaD8oJloKS97Fyo2fETgNY";

export function LoginBrandPanel() {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden bg-primary p-space-lg text-on-primary md:col-span-5 md:p-space-xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-primary-container opacity-20 blur-2xl"
      />
      <div aria-hidden="true" className="absolute top-0 left-0 h-1 w-full bg-tertiary-fixed" />

      <div className="relative z-10">
        <div className="mb-space-lg flex items-center gap-space-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container-lowest p-1 shadow-md">
            <img
              src={LOGO_URL}
              alt="School Administration Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <span className="block font-label-sm text-label-sm tracking-wider text-tertiary-fixed uppercase">
              Institutional Portal
            </span>
            <span className="block font-title-sm text-title-sm font-semibold text-on-primary">
              NDTC Finance Suite
            </span>
          </div>
        </div>

        <div aria-hidden="true" className="mb-space-md h-0.5 w-10 bg-tertiary-fixed" />

        <h1 className="mb-space-xs font-headline-lg text-headline-lg font-bold tracking-tight text-on-primary">
          Electronic-Payment-App
        </h1>
        <p className="mb-space-md font-title-sm text-title-sm font-medium text-tertiary-fixed">
          School Administration &amp; Finance Portal
        </p>
        <p className="max-w-sm font-body-md text-body-md leading-relaxed text-primary-fixed opacity-90">
          Secure administrative access for managing student accounts, academic terms,
          promissory agreements, and payment collections.
        </p>
      </div>

      <div className="relative z-10 mt-space-lg pt-space-lg">
        <div className="inline-flex items-center gap-space-xs rounded-full bg-primary-container/40 px-space-md py-space-xs font-label-sm text-label-sm text-on-primary">
          <span
            aria-hidden="true"
            className="material-symbols-outlined text-sm text-tertiary-fixed"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified_user
          </span>
          <span className="font-semibold tracking-wide uppercase">Authorized Personnel Only</span>
        </div>
        <p className="mt-space-xs font-body-sm text-body-sm text-primary-fixed-dim/80">
          Session activity is continuously monitored and audited under institutional policy.
        </p>
      </div>
    </div>
  );
}