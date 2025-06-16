export default function Head() {
  return (
    <>
      <script
        id="ga-stub"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{'analytics_storage':'denied'});`,
        }}
      />
    </>
  );
}
