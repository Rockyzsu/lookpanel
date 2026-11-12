import { useState, type ComponentProps } from "react";
import { site } from "@/config/site";
import { t } from "@/i18n";
import { Mail } from "lucide-react";
import { Tabs } from "radix-ui";
import { AnimatedSegmentedTabs } from "./ui/animated-segmented-tabs";
import { ResponsiveDialog } from "./ui/responsive-dialog";

type ContactMethod = "wechat" | "email";

export function AuthorContact({
  children = t("policy.contactAuthor"),
  ...props
}: ComponentProps<"button">) {
  const [open, setOpen] = useState(false);
  if (!site.contactEmail && !site.wechatQr) return null;

  return (
    <>
      <button {...props} type="button" onClick={() => setOpen(true)}>
        {children}
      </button>
      <ResponsiveDialog
        open={open}
        onOpenChange={setOpen}
        title={t("policy.contactAuthor")}
        description={
          site.contactEmail && site.wechatQr
            ? t("contact.emailOrWeChat")
            : site.contactEmail
              ? t("contact.email")
              : t("sites.wechat")
        }
        dialogClassName="gap-3 sm:max-w-[360px]"
      >
        <AuthorContactDetails />
      </ResponsiveDialog>
    </>
  );
}

/** WeChat QR code and email shown in the contact dialog. */
function AuthorContactDetails() {
  const [method, setMethod] = useState<ContactMethod>(
    site.wechatQr ? "wechat" : "email",
  );
  return (
    <AnimatedSegmentedTabs<ContactMethod>
      label={t("contact.contactMethod")}
      value={method}
      onValueChange={setMethod}
      listClassName="w-full"
      triggerClassName="text-xs"
      options={[
        ...(site.wechatQr
          ? [
              {
                value: "wechat" as const,
                label: (
                  <>
                    <img
                      src="/contact/wechat.svg"
                      alt=""
                      aria-hidden="true"
                      width="16"
                      height="16"
                      className="size-4"
                    />
                    {t("sites.wechat")}
                  </>
                ),
              },
            ]
          : []),
        ...(site.contactEmail
          ? [
              {
                value: "email" as const,
                label: (
                  <>
                    <Mail className="size-4" aria-hidden="true" />
                    {t("contact.email")}
                  </>
                ),
              },
            ]
          : []),
      ]}
    >
      <Tabs.Content
        value="wechat"
        className="mt-3 space-y-2 text-center outline-none"
      >
        <img
          src={site.wechatQr}
          alt={t("contact.weChatQrCode")}
          width="660"
          height="669"
          className="mx-auto h-auto w-48 max-w-full rounded-lg bg-white p-1.5"
        />
        <p className="text-xs text-muted-foreground">
          {t("contact.scanWeChatHint")}
        </p>
        <p className="text-xs font-medium text-amber-600 dark:text-amber-500">
          {t("contact.weChatRemarkHint")}
        </p>
      </Tabs.Content>
      <Tabs.Content
        value="email"
        className="mt-3 space-y-3 py-4 text-center outline-none"
      >
        <a
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-primary hover:bg-accent"
          href={`mailto:${site.contactEmail}`}
        >
          <Mail className="size-4" aria-hidden="true" />
          {site.contactEmail}
        </a>
        <p className="text-xs text-muted-foreground">
          {t("contact.emailHint")}
        </p>
      </Tabs.Content>
    </AnimatedSegmentedTabs>
  );
}
