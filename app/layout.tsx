import React from "react";

export const metadata = {
  title: "Royal Fabric Chandigarh",
  description: "Best Quality Dress Material in Manimajra",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
