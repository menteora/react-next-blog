export default function Head() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?display=swap&family=Newsreader:wght@400;500;700;800&family=Noto+Sans:wght@400;500;700;900"
      />
      <script
        id="ga-stub"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{'analytics_storage':'denied'});`,
        }}
      />
    </>
  );
}
