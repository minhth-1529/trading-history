"use client";

import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import dayjs from "dayjs";
import "dayjs/locale/es-us";
import { useServerInsertedHTML } from "next/navigation";
import React, { PropsWithChildren, useState } from "react";

// suppress useLayoutEffect warnings when running outside a browser
if (!process.browser) React.useLayoutEffect = React.useEffect;

dayjs.locale("es-us");

export default function AntdProvider({ children }: PropsWithChildren) {
  return (
    <ConfigProvider
      locale={enUS}
      theme={{
        token: {
          fontFamily: "inherit",
          colorBgLayout: "#fafafa",
          colorBgBase: "#ffffff",
          colorTextBase: "#2F2C35",
          colorPrimary: "#4353e2",
          colorSuccess: "#13bc8e",
          colorError: "#ef476f",
          controlHeight: 40,
          colorBgTextHover: "#f0f4ff",
          controlItemBgHover: "#f0f4ff",
        },
        components: {
          Menu: {
            itemBorderRadius: 0,
            itemMarginInline: 0,
            subMenuItemBorderRadius: 0,
            controlHeightLG: 48,
            subMenuItemBg: "#ffffff",
          },
          Button: {
            controlHeightLG: 48,
            paddingContentHorizontal: 24,
          },
        },
        hashed: false,
      }}
    >
      <AntdLoadStyle>{children}</AntdLoadStyle>
    </ConfigProvider>
  );
}

export function AntdLoadStyle({ children }: { children: React.ReactNode }) {
  const [cache] = useState(() => createCache());
  const render = <>{children}</>;

  useServerInsertedHTML(() => {
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `</script>${extractStyle(cache)}<script>`,
        }}
      />
    );
  });

  if (typeof window !== "undefined") {
    return render;
  }

  return (
    <StyleProvider hashPriority="high" cache={cache}>
      {render}
    </StyleProvider>
  );
}
